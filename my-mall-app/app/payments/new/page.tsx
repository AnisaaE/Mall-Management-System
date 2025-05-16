'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    shop_id: 1,
    amount: '',
    payment_method: 'Cash',
  });
  const [shops, setShops] = useState<{ shop_id: number; name: string }[]>([]);

  const router = useRouter();
 useEffect(() => {
    const fetchShops = async () => {
      const res = await fetch('/api/payments/new');
      if (res.ok) {
        const data = await res.json();
              console.log('shops from API:', data);

        setShops(data);
      } else {
        alert('Failed to load shops');
      }
    };

    fetchShops();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     console.log(formData.shop_id);
    const res = await fetch('/api/payments/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/payments');
    } else {
      alert('Error saving payment');
    }
  };



  return (
     <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Payment</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Shops with your active contract</label>
        <select
          name="shop_id"
          value={formData.shop_id}
          onChange={(e) => setFormData({ ...formData, shop_id: Number( e.target.value)  })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Choose a shop</option>
          {shops.map((shop) => (
            <option key={shop.shop_id} value={shop.shop_id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (TL)</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Online">Online</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/payments')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  </div>
  );
}
