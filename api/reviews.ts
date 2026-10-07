import { neon } from '@neondatabase/serverless'

type ReviewRow = { id: string; name: string; rating: number; text: string; date: string }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

export async function handleReviews(request: Request, databaseUrl: string | undefined): Promise<Response> {
  if (!databaseUrl) return json({ error: 'Database is not configured.' }, 500)
  const sql = neon(databaseUrl)

  if (request.method === 'GET') {
    const rows = (await sql`
      SELECT id, name, rating, text, created_at AS date
      FROM reviews
      ORDER BY created_at DESC
      LIMIT 100
    `) as ReviewRow[]
    return json({ reviews: rows })
  }

  if (request.method === 'POST') {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid request.' }, 400)
    }
    const { name, text, rating } = (body ?? {}) as Record<string, unknown>
    const cleanName = typeof name === 'string' ? name.trim() : ''
    const cleanText = typeof text === 'string' ? text.trim() : ''
    if (!cleanName || cleanName.length > 60) return json({ error: 'Please enter a name (max 60 characters).' }, 400)
    if (!cleanText || cleanText.length > 1000) return json({ error: 'Please write your review (max 1000 characters).' }, 400)
    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return json({ error: 'Rating must be between 1 and 5.' }, 400)
    }

    const [review] = (await sql`
      INSERT INTO reviews (name, rating, text)
      VALUES (${cleanName}, ${rating}, ${cleanText})
      RETURNING id, name, rating, text, created_at AS date
    `) as ReviewRow[]
    return json({ review }, 201)
  }

  return json({ error: 'Method not allowed.' }, 405)
}

export default {
  async fetch(request: Request) {
    try {
      return await handleReviews(request, process.env.DATABASE_URL)
    } catch (error) {
      console.error('Reviews API error:', error)
      return json({ error: 'Something went wrong. Please try again.' }, 500)
    }
  },
}
