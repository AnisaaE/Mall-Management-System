'use client';

import { useState } from 'react';

export function PaymentActionButtons({ paymentId }: { paymentId: number }) {
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (status: 'Completed' | 'Failed') => {
    setLoading(true);
    await fetch(`/api/payments/${paymentId}/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    location.reload(); 
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleUpdateStatus('Completed')}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
      >
        {loading ? 'Processing...' : 'Mark as Paid'}
      </button>
      <button
        onClick={() => handleUpdateStatus('Failed')}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
      >
        {loading ? 'Processing...' : 'Refuse Payment'}
      </button>
    </div>
  );
}
