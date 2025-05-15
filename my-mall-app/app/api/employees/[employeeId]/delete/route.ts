// my-mall-app/app/api/employees/[employeeId]/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function POST(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;

  try {
    // 1. Aktif kontrat kontrolü
    const activeContractsSql = `
      SELECT * FROM contract
      WHERE employee_id = ? AND end_date >= CURDATE()
    `;
    const activeContracts = await query(activeContractsSql, [employeeId]);

    if (activeContracts.length > 0) {
      return NextResponse.json(
        { error: 'Employee has active contracts and cannot be deleted.' },
        { status: 400 }
      );
    }

    // 2. Silme işlemi
    const deleteSql = `DELETE FROM employee WHERE employee_id = ?`;
    await query(deleteSql, [employeeId]);

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
