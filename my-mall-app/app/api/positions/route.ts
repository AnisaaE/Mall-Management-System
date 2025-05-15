import { query } from '@/lib/db/connection';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const positions = await query('SELECT position_id,position_name FROM positions');

    return NextResponse.json(positions, { status: 200 });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json({ error: 'Failed to fetch positions' }, { status: 500 });
  }
}
