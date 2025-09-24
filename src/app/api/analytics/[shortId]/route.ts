import { NextRequest, NextResponse } from 'next/server'
import { getLink } from '@/lib/storage'

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

    return NextResponse.json({
      link: {
        id: shortId,
        originalUrl: linkData.originalUrl,
        shortId: shortId,
        createdAt: linkData.createdAt,
        totalClicks: linkData.clicks
      },
      analytics: {
        totalClicks: linkData.clicks,
        uniqueVisitors: linkData.clicks, // Simplified for demo
        clicksWithReferer: 0, // Simplified for demo
        dailyClicks: [{
          date: linkData.createdAt,
          clicks: linkData.clicks
        }],
        topReferrers: [],
        topUserAgents: []
      }
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
