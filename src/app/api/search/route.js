import { NextResponse } from 'next/server';
import mockData from '@/data/mockInternships.json';

export async function GET() {
  try {
    const response = await fetch('https://internshala.com/hiring/search', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 60 } // Cache data for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Internshala API: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.warn('Error in api/search route (falling back to mock data):', error.message);
    // Return the cached mockData so the site always displays results
    return NextResponse.json(mockData);
  }
}
