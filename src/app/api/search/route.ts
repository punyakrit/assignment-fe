import { NextRequest, NextResponse } from 'next/server';
import { generateSearchSuggestions } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const suggestions = await generateSearchSuggestions(query);
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate search suggestions' },
      { status: 500 }
    );
  }
}
