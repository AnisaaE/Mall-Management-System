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

  const shops = await query('SELECT shop_id, name FROM shop where shop_id not in (select shop_id from active_contracts) ORDER BY name');
  const managers = await query(`
    SELECT m.manager_id, m.name 
    FROM manager m
    ORDER BY m.name
  `);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Creating new contract</h1>
        <NewContractForm shops={shops} managers={managers} />
      </div>
    </div>
  );
}