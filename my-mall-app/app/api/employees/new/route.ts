import { query } from '@/lib/db/connection';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, surname, position_id } = body;

    // Alan kontrolü
    if (!name || !surname || !position_id ) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Pozisyon kontrolü
    const positionResult = await query('SELECT 1 FROM positions WHERE position_id = ?', [position_id]);
    if (!Array.isArray(positionResult) || positionResult.length === 0) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    // Çalışanı ekle
    const insertResult = await query(
      'INSERT INTO employee (name, surname, position_id, username) VALUES (?, ?, ?,NULL)',
      [name, surname, position_id]
    );

    if ((insertResult as any).affectedRows > 0) {
      return NextResponse.json({ success: 'Employee created successfully' }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
    }
  } catch (err) {
    console.error('DB Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

