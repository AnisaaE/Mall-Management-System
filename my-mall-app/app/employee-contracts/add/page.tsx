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
    SELECT e.employee_id, e.name
    FROM employee e
    WHERE e.employee_id NOT IN (
      -- Aktif sözleşmesi olanları çıkar
      SELECT ec.employee_id
      FROM employee_contract ec
      JOIN duration d ON ec.duration_id = d.duration_id
      WHERE CURDATE() BETWEEN d.start_date AND d.end_date
    )
    AND e.employee_id NOT IN (
      -- duration_id NULL olanları da çıkar (bozuk kayıtlar)
      SELECT employee_id
      FROM employee_contract
      WHERE duration_id IS NULL
    )
    ORDER BY e.name
  `);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Çalışan Sözleşmesi Ekle</h1>
        <EmployeeContractForm employees={employees} />
      </div>
    </div>
  );
}
