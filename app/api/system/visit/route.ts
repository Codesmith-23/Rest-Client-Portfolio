import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Default to true if not specified (for safety), but frontend should control this
    const shouldIncrement = body.increment ?? true
    
    let count
    
    if (shouldIncrement) {
      // Increment the counter for new visitors
      count = await kv.incr('portfolio_visits')
    } else {
      // Just read the current count for returning visitors
      count = await kv.get<number>('portfolio_visits')
    }
    
    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('KV Error:', error)
    // Fallback number if Redis fails
    return NextResponse.json({ count: 1024 })
  }
}
