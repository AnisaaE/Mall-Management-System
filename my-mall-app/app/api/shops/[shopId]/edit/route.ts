import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(
  req: NextRequest,
  { params }: { params: { shopId: string } }
) {
  const session = await getServerSession(authOptions);

  // Проверка за сесия и роля
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const shopId = params.shopId;
  const body = await req.json();
  const { name, floor } = body;

  // Проверка на входните данни
  if (!name || !floor) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await query(
      `UPDATE shop SET name = ?, floor = ? WHERE shop_id = ?`,
      [name, floor, shopId]
    );
console.log('Shop updated successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
