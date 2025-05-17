import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

// GET: Etkinlik detaylarını getir
export async function GET(
  _req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sql = `
    SELECT event_id, name, start_date, end_date, cost, description
    FROM event
    WHERE event_id = ?
  `;
  const results = await query(sql, [eventId]);

  if (results.length === 0) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  return NextResponse.json(results[0]);
}

// PUT: Etkinlik güncelle
export async function PUT(
  req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, start_date, end_date, cost, description } = body;

  const sql = `
    UPDATE event
    SET name = ?, start_date = ?, end_date = ?, cost = ?, description = ?
    WHERE event_id = ?
  `;

  try {
    await query(sql, [name, start_date, end_date, cost, description, eventId]);
    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// ✅ DELETE: Etkinliği sil
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sql = `DELETE FROM event WHERE event_id = ?`;

  try {
    await query(sql, [eventId]);
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

