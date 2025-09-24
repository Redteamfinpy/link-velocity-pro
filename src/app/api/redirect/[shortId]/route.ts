import { NextRequest, NextResponse } from 'next/server'
import { getLink, incrementClicks } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params

    if (!shortId) {
      return NextResponse.json(
        { error: 'Short ID is required' },
        { status: 400 }
      )
    }

    // Get link from memory storage
    const linkData = getLink(shortId)

    if (!linkData) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    // Update click count
    incrementClicks(shortId)

    // Redirect to original URL
    return NextResponse.redirect(linkData.originalUrl, 302)

  } catch (error) {
    console.error('Error redirecting:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
