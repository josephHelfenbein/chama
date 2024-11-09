import axios from 'axios';
import { NextResponse } from 'next/server';

interface PolygonResult {
  v: number;   // volume
  vw: number;  // volume weighted average price
  o: number;   // open
  c: number;   // close
  h: number;   // high
  l: number;   // low
  t: number;   // timestamp
  n: number;   // number of transactions
}

interface TransformedData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function GET(request: Request): Promise<NextResponse> {
  // Extract the ticker from the query parameters
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  const POLYGON_API_KEY = '';

  if (!ticker) {
    return NextResponse.json({ error: "Ticker parameter is required" }, { status: 400 });
  }

  // Calculate the date range for the last 90 days
  const endDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/X:${ticker}/range/1/day/${startDate}/${endDate}`;

  try {
    const response = await axios.get(url, {
      params: {
        adjusted: true,
        sort: 'asc',
        limit: 5000,
        apiKey: POLYGON_API_KEY,
      },
    });

    // Transform the data
    const transformedData = response.data.results.map((item: PolygonResult): TransformedData => ({
      time: new Date(item.t).toISOString().split('T')[0],  // Convert timestamp to YYYY-MM-DD
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      volume: item.v
    }));

    return NextResponse.json(transformedData);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Polygon API' },
      { status: 500 }
    );
  }
}