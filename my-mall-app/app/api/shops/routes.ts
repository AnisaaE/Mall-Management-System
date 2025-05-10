// app/api/shops/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { query } from "@/lib/db/connection";
import { NextResponse } from "next/server";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let sql = '';
    let params: any[] = [];

    if (session.user.role === 'manager') {
      sql = `
        SELECT s.shop_id, s.name, s.floor, c.name AS category
        FROM shop s
        JOIN category c ON s.category_id = c.category_id
        JOIN shop_contract sc ON sc.shop_id = s.shop_id
        JOIN manager m ON sc.manager_id = m.manager_id
        WHERE m.username = ?
      `;
      params = [session.user.username];
    } else {
      sql = `
        SELECT s.shop_id, s.name, s.floor, c.name AS category
        FROM shop s
        JOIN category c ON s.category_id = c.category_id
      `;
    }

    const shops = await query(sql, params);
    return NextResponse.json(shops);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
