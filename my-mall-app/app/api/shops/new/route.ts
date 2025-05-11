// app/api/shops/new/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function POST(req: NextRequest) {
  const { name, floor, category_id } = await req.json();

  if (!name || !floor || !category_id) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const sql = 'INSERT INTO shop (name, floor, category_id) VALUES (?, ?, ?)';
    await query(sql, [name, floor, category_id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Shop name must be unique' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
