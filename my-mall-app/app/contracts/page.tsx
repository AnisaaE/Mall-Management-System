import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Contract = {
  contract_id: number;
  shop_name: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  manager_name: string;
  is_active: boolean;
};

export default async function ContractsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const contracts = await query<Contract[]>(`
    SELECT 
      sc.contract_id,
      s.name AS shop_name,
      DATE_FORMAT(d.start_date, '%d.%m.%Y') AS start_date,
      DATE_FORMAT(d.end_date, '%d.%m.%Y') AS end_date,
      sc.rent_amount,
      m.name AS manager_name,
      CURDATE() BETWEEN d.start_date AND d.end_date AS is_active
    FROM shop_contract sc
    JOIN shop s ON sc.shop_id = s.shop_id
    JOIN duration d ON sc.duration_id = d.duration_id
    LEFT JOIN manager m ON sc.manager_id = m.manager_id
    ORDER BY d.end_date DESC
  `);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Contracts</h1>
        {session.user.role === 'admin' && (
          <Link
            href="/contracts/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Contract
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.contract_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contract.shop_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.start_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.end_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.rent_amount} dollar.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.manager_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      contract.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contract.is_active ? 'Активен' : 'Изтекъл'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/contracts/${contract.contract_id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}