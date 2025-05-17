import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const sort = url.searchParams.get('sort');       // 'asc' or 'desc'
  const name = url.searchParams.get('name');       // optional filter by name

  let sql = `
    SELECT 
      event_id,
      name,
      start_date,
      end_date,
      cost,
      description
    FROM event
  `;
  const params: any[] = [];

  if (name && name.trim() !== '') {
    sql += ' WHERE name LIKE ?';
    params.push(`%${name}%`);
  }

  if (sort === 'asc') {
    sql += ' ORDER BY start_date ASC';
  } else if (sort === 'desc') {
    sql += ' ORDER BY start_date DESC';
  }

  try {
    const events = await query(sql, params);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
