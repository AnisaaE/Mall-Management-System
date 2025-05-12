import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { PaymentsTable } from '@/components/PaymentsTable';
import { redirect } from 'next/navigation';

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/login');

  let sql = `
    SELECT * FROM payments
    JOIN shop_contract ON payments.contract_id = shop_contract.contract_id
  `;

  if (session.user.role === 'manager') {
    sql += ` join manager on shop_contract.manager_id = manager.manager_id
    WHERE manager.username = ?`;
  }

  const payments = await query(sql, session.user.role === 'manager' ? [session.user.username] : []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <PaymentsTable payments={payments} />
      {session.user.role === 'manager' &&
       <div className="mt-6">
           <a href="/payments/new" className="btn btn-primary">New Payment</a>
        </div>}
    </div>
  );
}
