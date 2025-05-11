import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import NewContractForm from '@/components/NewContractForm';
import { query } from '@/lib/db/connection';

export default async function NewContractPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/contracts');
  }

  const shops = await query('SELECT shop_id, name FROM shop ORDER BY name');

  const managers = await query(`
    SELECT m.manager_id, m.name 
    FROM manager m
    JOIN users u ON m.username = u.username
    WHERE u.role = 'manager'
    ORDER BY m.name
  `);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Contract</h1>
        <NewContractForm shops={shops} managers={managers} />
      </div>
    </div>
  );
}