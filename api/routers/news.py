from fastapi import APIRouter, HTTPException
import requests
from ..schemas.news import NewsSearchRequest, NewsSearchResponse, NewsArticle
from ..core.config import settings
from datetime import datetime
import pytz

router = APIRouter()

def format_date_for_google(date: datetime) -> str:
    """Formats datetime to Google's search format (mm/dd/yyyy)"""
    return date.strftime("%m/%d/%Y")

@router.post("/search", response_model=NewsSearchResponse)
async def search_news(search_request: NewsSearchRequest):
    try:
        # Validate credentials
        settings.validate_credentials()
        
        # Set end_date to current time if not provided
        end_date = search_request.end_date or datetime.now(pytz.UTC)
        
        # Validate date range
        if search_request.start_date > end_date:
            raise HTTPException(
                status_code=400,
                detail="start_date cannot be later than end_date"
            )
        
        # Handle both single keyword and list of keywords
        keywords = search_request.keywords
        if isinstance(keywords, list):
            query = " OR ".join(keywords)
        else:
            query = keywords

        # Format dates for Google search
        start_date_str = format_date_for_google(search_request.start_date)
        end_date_str = format_date_for_google(end_date)
        
        # Create the custom date range parameter
        # Format: cdr:1,cd_min:MM/DD/YYYY,cd_max:MM/DD/YYYY
        date_filter = f"cdr:1,cd_min:{start_date_str},cd_max:{end_date_str}"

        # Structure payload for Oxylabs
        payload = {
            'source': 'google_search',
            'domain': 'com',
            'query': query,
            'parse': True,
            'context': [
                {'key': 'tbm', 'value': 'nws'},
                {'key': 'tbs', 'value': date_filter},
            ],
            'limit': search_request.limit
        }

        # Make request to Oxylabs
        response = requests.post(
            'https://realtime.oxylabs.io/v1/queries',
            auth=(settings.OXYLABS_USERNAME, settings.OXYLABS_PASSWORD),
            json=payload,
        )

        # Error handling
        if response.status_code == 401:
            raise HTTPException(
                status_code=401,
                detail="Authentication failed. Please check your Oxylabs credentials."
            )
        elif response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Oxylabs API error: {response.text}"
            )

        data = response.json()
        
        # Process and format the results
        articles = []
        
        # Handle the correct response structure
        if isinstance(data, dict) and 'results' in data:
            results = data['results']
            if isinstance(results, list) and len(results) > 0:
                first_result = results[0]
                if 'content' in first_result:
                    main_results = first_result['content'].get('results', {}).get('main', [])
                    
                    for result in main_results:
                        articles.append(NewsArticle(
                            url=result['url'],
                            title=result['title'],
                            desc=result.get('desc', ''),
                            source=result['source'],
                            publish_date=result.get('relative_publish_date', '')
                        ))

        return NewsSearchResponse(
            articles=articles[:search_request.limit],
            total_results=len(articles)
        )

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing news search: {str(e)}")

