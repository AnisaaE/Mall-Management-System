// app/employees/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db/connection';
import { Employee } from '@/types/db_types';
import Link from 'next/link';


export default async function EmployeesPage() {
   const session = await getServerSession(authOptions);
   if (!session?.user) redirect('/login');

  let sql = `
    SELECT e.employee_id, e.name AS first_name, e.surname AS last_name, p.position_name AS position
    FROM employee e
    LEFT JOIN positions p ON e.position_id = p.position_id
  `;
  const params: any[] = [];

  // Eğer kullanıcı manager ise, sadece kendi username'ine ait çalışanları göster
   if (session.user.role === 'manager') {
     sql += ` WHERE e.username = ?`;
     params.push(session.user.username);
   }

  const employees = await query<Employee[]>(sql, params);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
         {session.user.role === 'manager' ? 'Your Employees' : 'All Employees'} 
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => (
          <Link
          
            key={emp.employee_id}
            href={`/employees/${emp.employee_id}`} 
            className="border p-4 rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{emp.first_name} {emp.last_name}</h2>
            <p className="text-gray-600">{emp.position || 'No Position'}</p>
          </Link>
        ))}
      </div>

      {session.user.role === 'admin' &&   (
        <a
          href="/employees/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 mt-6 rounded hover:bg-blue-700"
        >
          + Add Employee
        </a>
      )}
    </div>
  );
}
