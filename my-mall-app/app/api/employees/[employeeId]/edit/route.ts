import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function POST(req: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const employeeId = params.employeeId;
    const body = await req.json();
    const { first_name, last_name ,position_id} = body;

    if (!first_name || !last_name || !position_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = `
      UPDATE employee
      SET name = ?, surname = ? ,position_id=?
      WHERE employee_id = ?
    `;
    await query(sql, [first_name, last_name, position_id,employeeId]);

    return NextResponse.json({ message: 'Employee updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
