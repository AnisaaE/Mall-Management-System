// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET() {
  const categories = await query('SELECT category_id, name FROM category');
  return NextResponse.json(categories);
}
