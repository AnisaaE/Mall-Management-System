import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, start_date, end_date, cost, description } = await req.json();

  if (!name || !start_date || !end_date || !cost || !description) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const sql = `
      INSERT INTO event (name, start_date, end_date, cost, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    await query(sql, [name, start_date, end_date, cost, description]);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
