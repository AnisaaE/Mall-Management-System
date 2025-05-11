// app/api/shops/[shopId]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

export async function GET(
  _req: Request,
  { params }: { params: { shopId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const shopSql = `
    SELECT s.shop_id, s.name, s.floor, c.name AS category
    FROM shop s
    JOIN category c ON s.category_id = c.category_id
    WHERE s.shop_id = ?
  `;
  const shopResults = await query(shopSql, [params.shopId]);

  if (shopResults.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const shop = shopResults[0];

  const contractSql = `
    SELECT * FROM active_contracts
    WHERE shop_id = ?
  `;
  const contractResults = await query(contractSql, [params.shopId]);

  return NextResponse.json({
    ...shop,
    activeContracts: contractResults
  });
}
