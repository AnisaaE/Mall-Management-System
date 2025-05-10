'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Shop = {
  shop_id: number;
  name: string;
  floor: string;
  category: string;
};

export default function EditForm({ shop }: { shop: Shop }) {
  const router = useRouter();
  const [name, setName] = useState(shop.name);
  const [floor, setFloor] = useState(shop.floor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch(`/api/shops/${shop.shop_id}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, floor }),
    });

    if (res.ok) {
      router.push(`/shops/${shop.shop_id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update shop');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Shop</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Floor:</label>
          <input
            type="text"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
