import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { shop_id, amount, payment_date, payment_method } = body;

  try {
    const contractRes = await query(
      `SELECT contract_id FROM shop_contract sc
       JOIN duration d ON sc.duration_id = d.duration_id
       WHERE sc.shop_id = ? AND CURDATE() BETWEEN d.start_date AND d.end_date
       LIMIT 1`,
      [shop_id]
    );

    if (contractRes.length === 0) {
      return NextResponse.json({ error: 'No active contract found' }, { status: 400 });
    }

    const contract_id = contractRes[0].contract_id;

    await query(
      `INSERT INTO payments (contract_id, amount, payment_date, status, payment_method)
       VALUES (?, ?, ?, 'Pending', ?)`,
      [contract_id, amount, payment_date, payment_method]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
