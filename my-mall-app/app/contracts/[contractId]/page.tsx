import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Contract } from '@/types/db_types';

export default async function ContractDetailPage({
    params,
}: {
    params: { contractId: string };
}) {
    const { contractId } = params;

    const session = await getServerSession(authOptions);
    if (!session?.user) redirect('/login');
    if (session.user.role !== 'admin') redirect('/unauthorized');

    const sql = `
        SELECT sc.contract_id, s.name AS shop_name, 
        m.name AS manager, d.start_date, d.end_date, 
        sc.rent_amount, c.mail as manager_mail, 
        c.phone as manager_phone, c.address as manager_address
        FROM shop_contract sc
        JOIN shop s ON sc.shop_id = s.shop_id
        JOIN manager m ON sc.manager_id = m.manager_id
        JOIN duration d ON sc.duration_id = d.duration_id
        JOIN contact c ON c.contact_id = m.contact_id
        WHERE sc.contract_id = ?
    `;


    const results = await query<Contract[]>(sql, [contractId]);

    if (results.length === 0) {
        return <div className="p-8 max-w-4xl mx-auto">The contract was not found.</div>;
    }

    const contract = results[0];

    return (
       <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contract Details</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
        <div>
          <span className="font-semibold">Contract ID:</span> {contract.contract_id}
        </div>
        <div>
          <span className="font-semibold">Shop Name:</span> {contract.shop_name}
        </div>
        <div>
          <span className="font-semibold">Manager:</span> {contract.manager}
        </div>
        <div>
          <span className="font-semibold">Rent Amount:</span> ${contract.rent_amount}
        </div>
        <div>
          <span className="font-semibold">Start Date:</span>{' '}
          {format(new Date(contract.start_date), 'dd.MM.yyyy')}
        </div>
        <div>
          <span className="font-semibold">End Date:</span>{' '}
          {format(new Date(contract.end_date), 'dd.MM.yyyy')}
        </div>
        <div>
          <span className="font-semibold">Manager Email:</span> {contract.manager_mail}
        </div>
        <div>
          <span className="font-semibold">Manager Phone:</span> {contract.manager_phone}
        </div>
        <div className="md:col-span-2">
          <span className="font-semibold">Manager Address:</span> {contract.manager_address}
        </div>
      </div>
    </div>
    );
}
