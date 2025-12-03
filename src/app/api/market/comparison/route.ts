import { NextRequest, NextResponse } from 'next/server'
import { getMarketComparison } from '@/lib/gemini'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')

    if (!brand || !model) {
      return NextResponse.json(
        { error: 'Brand and model are required' },
        { status: 400 }
      )
    }

    try {
      const comparison = await getMarketComparison(brand, model)
      return NextResponse.json({ comparison })
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to fetch market data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Market comparison error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

