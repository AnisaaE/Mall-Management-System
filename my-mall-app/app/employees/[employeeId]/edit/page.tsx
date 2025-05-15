// app/employees/[employeeId]/edit/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { redirect } from 'next/navigation';
import EditEmployeeForm from '@/components/EditEmployeeForm';
import { Employee } from '@/types/db_types';

export default async function EditEmployeePage({
  params,
}: {
  params:{ employeeId: string };
}) {
  const session = await getServerSession(authOptions);
  const { employeeId } = params;

  if (!session?.user) redirect('/login');
  if (session.user.role !== 'admin') redirect('/unauthorized');

  const sql = `
    SELECT e.employee_id, e.name AS first_name, e.surname AS last_name, e.position_id, p.position_name AS position
    FROM employee e
    JOIN positions p ON e.position_id = p.position_id
    WHERE e.employee_id = ?
  `;
  const results = await query<Employee[]>(sql, [employeeId]);

  if (results.length === 0) {
    return <div className="p-8">Employee not found.</div>;
  }

  return <EditEmployeeForm employee={results[0]} />;
}
