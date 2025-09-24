import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { addLink } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Generate short ID
    const shortId = nanoid(8)
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/l/${shortId}`

    // Store in memory (replace with database)
    addLink(shortId, url)

    return NextResponse.json({
      shortUrl,
      originalUrl: url,
      shortId,
      clicks: 0,
      createdAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error shortening URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Link Velocity Pro API - URL Shortener' },
    { status: 200 }
  )
}
