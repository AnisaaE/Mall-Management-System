import { query } from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { shopId: string } }) {
  const { shopId } = params;

  // Проверка за сесия
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.redirect('/login');
  }

  try {
    // Изтриване на магазина от базата данни
    await query('DELETE FROM shop WHERE shop_id = ?', [shopId]);

    return NextResponse.json({ message: 'Shop deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Error deleting shop' }, { status: 500 });
  }
}
