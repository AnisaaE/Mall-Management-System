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
  const { shop_id, amount, payment_method } = body;

  try {
    const contractRes = await query(
      `SELECT contract_id FROM shop_contract sc
       JOIN duration d ON sc.duration_id = d.duration_id
       WHERE sc.shop_id = ? AND CURDATE() BETWEEN d.start_date AND d.end_date 
       LIMIT 1`,
      [shop_id]
    );

    if (contractRes.length === 0) {
      console.log('No active contract found');
      console.log(shop_id)
      return NextResponse.json({ error: 'No active contract found' }, { status: 400 });
    }

    const contract_id = contractRes[0].contract_id;

    await query(
      `INSERT INTO payments (contract_id, amount, status, payment_method )
       VALUES (?, ?, 'Pending', ?)`,
      [contract_id, amount, payment_method]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const shops = await query(
      `SELECT s.name, s.shop_id
       FROM shop s 
       JOIN shop_contract sc ON s.shop_id = sc.shop_id
       JOIN manager m ON m.manager_id = sc.manager_id
       JOIN active_contracts ac ON ac.shop_id = s.shop_id
       WHERE m.username = ?`,
      [session.user.username]
    );

    return NextResponse.json(shops, { status: 200 });
  } catch (err) {
    console.error('GET /api/payments/new error:', err);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}