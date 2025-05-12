import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

export async function POST(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const paymentId = Number(params.paymentId);
  if (isNaN(paymentId)) {
    return NextResponse.json({ error: 'Invalid payment ID' }, { status: 400 });
  }

  const body = await req.json();
  const { status } = body;

  const validStatuses = ['Completed', 'Failed'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const updateSql = `
      UPDATE payments
      SET status = ?
      WHERE payment_id = ?
    `;

    const result = await query(updateSql, [status, paymentId]);

    return NextResponse.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
