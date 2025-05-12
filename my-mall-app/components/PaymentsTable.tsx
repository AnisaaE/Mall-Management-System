'use client';
import { PaymentActionButtons } from './PaymentActionsButtons';
import { Payment } from '@/types/db_types';
import { useSession } from 'next-auth/react';

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-300 bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
             <th className="p-3 text-left font-medium">Contract ID</th> 
            <th className="p-3 text-left font-medium">Date</th>
            <th className="p-3 text-left font-medium">Amount</th>
            <th className="p-3 text-left font-medium">Method</th>
            <th className="p-3 text-left font-medium">Status</th>
            {role !== 'manager' && <th className="p-3 text-left font-medium">Action</th>}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id} className="hover:bg-gray-50">
              <td className="p-3">{payment.contract_id}</td>
              <td className="p-3">{new Date(payment.payment_date).toLocaleDateString()}</td>
              <td className="p-3">₺{payment.amount}</td>
              <td className="p-3">{payment.payment_method}</td>
              <td className="p-3">{payment.status}</td>
              {role !== 'manager' && (
                <td className="p-3">
                  {payment.status === 'Pending' ? (
                    <PaymentActionButtons paymentId={payment.payment_id} />
                  ) : (
                    <span className={payment.status === 'Completed' ? 'text-green-600' : 'text-red-600'}>{payment.status==='Completed' ? '✔' : '✘'}</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
