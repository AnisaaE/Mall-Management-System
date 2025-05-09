import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection'; // провери пътя, ако е различен

export async function GET() {
  try {
    const result = await query('SELECT * FROM users');
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('DB Error:', error); // за дебъг
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
  
}
