import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Unsplash fetch failed' }, { status: 500 })
  }

  const data = await res.json()
  const photo = data.results?.[0]

  if (!photo) {
    return NextResponse.json({ url: null })
  }

  return NextResponse.json({
    url: photo.urls.regular,
    credit: photo.user.name,
    creditLink: photo.user.links.html,
  })
}
