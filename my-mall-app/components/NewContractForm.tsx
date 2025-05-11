'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewContractForm({ 
  shops, 
  managers: initialManagers 
}: { 
  shops: { shop_id: number; name: string }[],
  managers: { manager_id: number; name: string }[]
}) {
  const router = useRouter();
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managers, setManagers] = useState(initialManagers);
  const [newManager, setNewManager] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [formData, setFormData] = useState({
    shop_id: '',
    start_date: '',
    end_date: '',
    rent_amount: '',
    manager_id: ''
  });

  const handleAddManager = async () => {
    if (!newManager.name) return;
    
    const response = await fetch('/api/managers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newManager),
    });
    
    if (response.ok) {
      const result = await response.json();
      // Добавяме новия мениджър към списъка
      setManagers([...managers, result]);
      // Автоматично избираме новия мениджър
      setFormData({...formData, manager_id: result.manager_id});
      // Затваряме модала и нулираме формата
      setShowManagerModal(false);
      setNewManager({ name: '', phone: '', email: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const contractResponse = await fetch('/api/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (contractResponse.ok) {
      router.push('/contracts');
      router.refresh();
    }
  };
  return (
    <>
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
          <div className="mt-1 flex gap-2">
            <select
              name="manager_id"
              value={formData.manager_id}
              onChange={(e) => setFormData({...formData, manager_id: e.target.value})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Choose a manager</option>
              {managers.map((manager) => (
                <option key={manager.manager_id} value={manager.manager_id}>
                  {manager.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowManagerModal(true)}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Нов мениджър
            </button>
          </div>
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
    {showManagerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add new manager</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newManager.name}
                  onChange={(e) => setNewManager({...newManager, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={newManager.phone}
                  onChange={(e) => setNewManager({...newManager, phone: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newManager.email}
                  onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowManagerModal(false);
                  setNewManager({ name: '', phone: '', email: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddManager}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Manager
              </button>
            </div>
          </div>
        </div>
      )}
       </>
  );
}