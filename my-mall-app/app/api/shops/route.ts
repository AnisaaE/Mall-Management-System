import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

export async function GET(req: Request) {

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // read optional query params
  const url = new URL(req.url);
  const sort = url.searchParams.get('sort');       // 'asc' or 'desc'
  const category = url.searchParams.get('category'); // e.g. 'Toys'

  let sql = `
    SELECT s.shop_id, s.name, s.floor, c.name AS category
    FROM shop s
    JOIN category c ON s.category_id = c.category_id
  `;
  const params: any[] = [];

  // if manager, filter to their shops
  if (session.user.role === 'manager') {
    sql += `
      JOIN shop_contract sc ON sc.shop_id = s.shop_id
      JOIN manager m ON sc.manager_id = m.manager_id
      WHERE m.username = ?
    `;
    params.push(session.user.username);
  }

  // filter by category if provided
  if (category && category !== 'All') {
    sql += params.length ? ' AND' : ' WHERE';
    sql += ' c.name = ?';
    params.push(category);
  }

  // append sort if requested
  if (sort === 'asc') {
    sql += ' ORDER BY s.name ASC';
  } else if (sort === 'desc') {
    sql += ' ORDER BY s.name DESC';
  }

  const shops = await query(sql, params);
  return NextResponse.json(shops);
}
