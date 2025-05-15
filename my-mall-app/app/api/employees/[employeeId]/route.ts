// my-mall-app/app/api/employees/[employeeId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;

  try {
    const sql = `
      SELECT employee_id, first_name, last_name
      FROM employee
      WHERE employee_id = ?
    `;
    const result = await query<any[]>(sql, [employeeId]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch employee:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;
  console.log('DELETE request received for employee:', params.employeeId);

  try {


    // 2. Silme işlemi
    const deleteSql = `DELETE FROM employee WHERE employee_id = ?`;
    await query(deleteSql, [employeeId]);

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
