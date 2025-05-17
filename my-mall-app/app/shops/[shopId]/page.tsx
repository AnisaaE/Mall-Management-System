import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { redirect } from 'next/navigation';
import DeleteShopButton from '@/components/DeleteShopButton';
import { format } from 'date-fns';
import { Contract, Shop } from '@/types/db_types';
import Link from 'next/link';

export default async function ShopDetailPage({
  params,
}: {
  params: { shopId: string };
}) {
  const { shopId } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const sql = `
    SELECT s.shop_id, s.name, s.floor, c.name AS category
    FROM shop s
    JOIN category c ON s.category_id = c.category_id
    WHERE s.shop_id = ?
  `;
  const results = await query<Shop[]>(sql, [shopId]);

  const contractSql = `
    SELECT * FROM active_contracts
    WHERE shop_id = ?
  `;
  const activeContracts = await query<Contract[]>(contractSql, [shopId]);

  if (results.length === 0) {
    return <div className="p-8 max-w-4xl mx-auto">The shop was not found.</div>;
  }

  const shop = results[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
            <div className="flex gap-4 mt-2 text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Floor: {shop.floor}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2H5z" />
                </svg>
                Category: {shop.category}
              </span>
            </div>
          </div>

          {session.user.role === 'admin' && (
            <div className="flex gap-2">
              <a
                href={`/shops/${shop.shop_id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </a>
              <DeleteShopButton shopId={shop.shop_id} />
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Active contracts
          </h2>

          {activeContracts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              No active contracts
            </div>
          ) : (
            <div className="space-y-3">
              {activeContracts.map((contract) => (
                <div key={contract.contract_id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start date</p>
                      <p className="font-medium">{format(contract.start_date, 'dd.MM.yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End date</p>
                      <p className="font-medium">{format(contract.end_date, 'dd.MM.yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rent</p>
                      <p className="font-medium">{contract.rent_amount} TL</p>
                    </div>
                  </div>
                  {contract.manager_name && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Manager</p>
                      <p className="font-medium">{contract.manager_name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-right">
        <Link href="/shops" className="inline-block bg-green-600 text-white px-4 py-2 mt-6 rounded hover:bg-blue-700">← Back to Shops</Link>
        
      </div>
    </div>
  );
}