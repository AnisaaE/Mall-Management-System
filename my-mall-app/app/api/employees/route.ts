import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const sort = url.searchParams.get('sort'); // asc / desc
  const search = url.searchParams.get('search'); // partial name

  let sql = `
    SELECT e.employee_id, e.name AS first_name, e.surname AS last_name, p.position_name AS position
    FROM employee e
    LEFT JOIN positions p ON e.position_id = p.position_id
  `;
  const params: any[] = [];

  if (session.user.role === 'manager') {
    sql += ` WHERE e.username = ?`;
    params.push(session.user.username);
  }

  if (search) {
    sql += params.length ? ' AND' : ' WHERE';
    sql += ` (e.name LIKE ? OR e.surname LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (sort === 'asc') {
    sql += ' ORDER BY e.name ASC';
  } else if (sort === 'desc') {
    sql += ' ORDER BY e.name DESC';
  }

  const employees = await query(sql, params);
  return NextResponse.json(employees);
}
