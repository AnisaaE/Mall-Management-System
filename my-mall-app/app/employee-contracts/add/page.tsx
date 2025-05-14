import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db/connection';
import EmployeeContractForm from '@/components/EmployeeContractForm';

export default async function AddEmployeeContractPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/employee-contracts');
  }

  const employees = await query(`
    SELECT employee_id, name 
    FROM employee 
    ORDER BY name
  `);

  const durations = await query(`
    SELECT duration_id, 
           DATE_FORMAT(start_date, '%d.%m.%Y') AS start_date,
           DATE_FORMAT(end_date, '%d.%m.%Y') AS end_date
    FROM duration
    ORDER BY start_date DESC
  `);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Çalışan Sözleşmesi Ekle</h1>
        <EmployeeContractForm employees={employees} durations={durations} />
      </div>
    </div>
  );
}
