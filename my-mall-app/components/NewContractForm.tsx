'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewContractForm({ 
  shops, 
  managers 
}: { 
  shops: { shop_id: number; name: string }[],
  managers: { manager_id: number; name: string }[]
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shop_id: '',
    start_date: '',
    end_date: '',
    rent_amount: '',
    manager_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push('/contracts');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Shop</label>
        <select
          name="shop_id"
          value={formData.shop_id}
          onChange={(e) => setFormData({...formData, shop_id: e.target.value})}
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
          <label className="block text-sm font-medium text-gray-700">Start date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Rent (TL)</label>
          <input
            type="number"
            step="0.01"
            name="rent_amount"
            value={formData.rent_amount}
            onChange={(e) => setFormData({...formData, rent_amount: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Manager</label>
          <select
            name="manager_id"
            value={formData.manager_id}
            onChange={(e) => setFormData({...formData, manager_id: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Not assigned</option>
            {managers.map((manager) => (
              <option key={manager.manager_id} value={manager.manager_id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/contracts')}
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
  );
}