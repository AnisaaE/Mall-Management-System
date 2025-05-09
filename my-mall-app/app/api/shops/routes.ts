// app/api/shops/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { query } from "@/lib/db/connection";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let sql: string;
  let params: any[] = [];

  if (user.role === "admin" || user.role === "accountant") {
    sql = `
      SELECT s.shop_id, s.name, s.floor, c.name AS category
      FROM shop s
      LEFT JOIN category c ON s.category_id = c.category_id;
    `;
  } else if (user.role === "manager") {
    sql = `
      SELECT s.shop_id, s.name, s.floor, c.name AS category
      FROM shop s
      JOIN shop_contract sc ON sc.shop_id = s.shop_id
      JOIN manager m ON m.manager_id = sc.manager_id
      JOIN category c ON s.category_id = c.category_id
      WHERE m.name = ?;
    `;
    params = [user.name]; // Заменяш с каквото ти е нужно (може би username -> contact_id)
  } else {
    return Response.json({ error: "Invalid role" }, { status: 403 });
  }

  const shops = await query(sql, params);
  return Response.json(shops);
}
