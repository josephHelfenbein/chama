from fastapi import APIRouter, HTTPException
from ..schemas.telegram import (TelegramSearchRequest, TelegramSearchResponse, 
                              TelegramMessage, DialogListResponse, DialogInfo,
                              AuthRequest, AuthCodeRequest, AuthResponse)
from ..core.config import settings
from datetime import datetime
import pytz
from telethon import TelegramClient, sync
from telethon.tl.types import Channel, Chat, User
from telethon.errors import SessionPasswordNeededError
import asyncio
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)


router = APIRouter()

# Store phone codes temporarily
phone_codes: Dict[str, str] = {}

# Initialize Telegram client
client = TelegramClient(
    'anon', 
    settings.TELEGRAM_API_ID, 
    settings.TELEGRAM_API_HASH
)


async def initialize_client():
    """Initialize and connect the Telegram client"""
    try:
        if not client.is_connected():
            await client.connect()
            
        if not await client.is_user_authorized():
            # Try to sign in with the stored session
            if settings.TELEGRAM_PHONE and settings.TELEGRAM_CODE:
                try:
                    await client.sign_in(
                        settings.TELEGRAM_PHONE, 
                        settings.TELEGRAM_CODE
                    )
                    logger.info("Telegram auto-authentication successful")
                except SessionPasswordNeededError:
                    if settings.TELEGRAM_2FA_PASSWORD:
                        await client.sign_in(password=settings.TELEGRAM_2FA_PASSWORD)
                        logger.info("Telegram 2FA authentication successful")
                    else:
                        logger.warning("2FA required but password not provided")
            else:
                logger.warning("No stored credentials found. Manual authentication required.")
        else:
            logger.info("Telegram client already authorized")
            
    except Exception as e:
        logger.error(f"Error during Telegram initialization: {e}")
        raise

async def disconnect_client():
    """Disconnect the Telegram client"""
    try:
        if client.is_connected():
            await client.disconnect()
    except Exception as e:
        logger.error(f"Error disconnecting Telegram client: {e}")

async def get_connection_status():
    """Get current connection and authentication status"""
    try:
        is_connected = client.is_connected()
        is_authorized = await client.is_user_authorized() if is_connected else False
        return {
            "connected": is_connected,
            "authorized": is_authorized,
        }
    except Exception as e:
        logger.error(f"Error checking connection status: {e}")
        return {
            "connected": False,
            "authorized": False,
            "error": str(e)
        }



@router.post("/auth/send-code", response_model=AuthResponse)
async def send_code(auth: AuthRequest):
    """Send authentication code to phone number"""
    try:
        if not client.is_connected():
            await client.connect()

        # If already authorized, return success
        if await client.is_user_authorized():
            return AuthResponse(message="Already authenticated", 
                             phone=auth.phone_number,
                             requires_code=False)

        # Send code
        await client.send_code_request(auth.phone_number)
        
        return AuthResponse(
            message="Authentication code sent",
            phone=auth.phone_number,
            requires_code=True
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error sending authentication code: {str(e)}"
        )

@router.post("/auth/verify-code", response_model=AuthResponse)
async def verify_code(auth: AuthCodeRequest):
    """Verify the authentication code"""
    try:
        if not client.is_connected():
            await client.connect()

        # If already authorized, return success
        if await client.is_user_authorized():
            return AuthResponse(message="Already authenticated", 
                             phone=auth.phone_number,
                             requires_code=False)

        # Sign in with code
        try:
            await client.sign_in(auth.phone_number, auth.code)
            return AuthResponse(
                message="Successfully authenticated",
                phone=auth.phone_number,
                requires_code=False
            )
        except SessionPasswordNeededError:
            # Handle 2FA if enabled
            if auth.password:
                await client.sign_in(password=auth.password)
                return AuthResponse(
                    message="Successfully authenticated with 2FA",
                    phone=auth.phone_number,
                    requires_code=False
                )
            else:
                raise HTTPException(
                    status_code=400,
                    detail="2FA password required"
                )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error verifying code: {str(e)}"
        )

@router.get("/auth/status")
async def auth_status():
    """Check authentication status"""
    try:
        if not client.is_connected():
            await client.connect()
        
        is_authorized = await client.is_user_authorized()
        return {
            "is_authenticated": is_authorized,
            "message": "Authenticated" if is_authorized else "Not authenticated"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error checking auth status: {str(e)}"
        )

@router.get("/dialogs", response_model=DialogListResponse)
async def list_dialogs():
    """List all accessible dialogs (chats, channels, groups)"""
    try:
        if not client.is_connected():
            await client.connect()

        # Check if authenticated
        if not await client.is_user_authorized():
            raise HTTPException(
                status_code=401,
                detail="Not authenticated. Please authenticate first using /auth/send-code"
            )

        dialogs = []
        async for dialog in client.iter_dialogs():
            entity = dialog.entity
            
            # Skip private chats with users
            if isinstance(entity, User):
                continue
                
            dialog_info = {
                "id": entity.id,
                "title": entity.title,
                "type": "channel" if isinstance(entity, Channel) else "group",
                "username": getattr(entity, 'username', None),
                "members_count": getattr(entity, 'participants_count', None),
                "is_public": not getattr(entity, 'restricted', True) if isinstance(entity, Channel) else False
            }
            
            if isinstance(entity, Channel):
                dialog_info["full_id"] = f"-100{entity.id}"
            
            dialogs.append(DialogInfo(**dialog_info))

        return DialogListResponse(dialogs=dialogs)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing dialogs: {str(e)}"
        )

@router.post("/search", response_model=TelegramSearchResponse)
async def search_telegram(search_request: TelegramSearchRequest):
    try:
        # Connect to Telegram
        if not client.is_connected():
            await client.connect()
        
        # Set end_date to current time if not provided
        end_date = search_request.end_date or datetime.now(pytz.UTC)
        
        # Validate date range
        if search_request.start_date > end_date:
            raise HTTPException(
                status_code=400,
                detail="start_date cannot be later than end_date"
            )

        # Get the channel entity
        try:
            entity = await client.get_entity(search_request.chat_id)
        except ValueError as e:
            raise HTTPException(
                status_code=404,
                detail=f"Channel not found: {str(e)}"
            )

        # Get messages
        messages = []
        async for message in client.iter_messages(
            entity,
            limit=search_request.limit,
            search=search_request.query,
            offset_date=end_date,
            min_id=0  # Start from the earliest message
        ):
            # Skip messages outside our date range
            message_date = datetime.fromtimestamp(message.date.timestamp(), pytz.UTC)
            if message_date < search_request.start_date:
                continue
                
            # Determine media type and URL
            media_type = None
            media_url = None
            
            if message.photo:
                media_type = 'photo'
            elif message.video:
                media_type = 'video'
            elif message.document:
                media_type = 'document'
            elif message.audio:
                media_type = 'audio'

            # Create message object
            messages.append(TelegramMessage(
                message_id=message.id,
                date=message_date.isoformat(),
                text=message.text or "",
                from_user=message.sender.username if message.sender else "",
                reply_to_message_id=message.reply_to_msg_id,
                media_type=media_type,
                media_url=None  # We don't download media URLs for public groups
            ))

        return TelegramSearchResponse(
            messages=messages,
            total_results=len(messages)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing Telegram search: {str(e)}")

@router.on_event("shutdown")
async def shutdown_event():
    if client.is_connected():
        await client.disconnect()