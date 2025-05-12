'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DeleteShopPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const [shop, setShop] = useState(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShopId = async () => {
      const { shopId } = await params;
      setShopId(shopId); 
    };

    fetchShopId();
  }, [params]);

  useEffect(() => {
    if (!shopId) return; 
    const fetchShopDetails = async () => {
      const res = await fetch(`/api/shops/${shopId}`);
      if (res.ok) {
        const data = await res.json();
        setShop(data);
      }
    };
    fetchShopDetails();
  }, [shopId]);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/shops/${shopId}/delete`, {
      method: 'POST',
    });

    if (res.ok) {
      alert('The shop has been deleted!');
      router.push('/shops'); 
    } else {
      alert('The shop can not be deleted because it has running contracts.');
    }
  };

  if (!shop) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Delete Shop</h1>
      <p className="mb-2">
        Are you sure you want to delete this shop <strong>{shop.name}</strong>?
      </p>
      <form onSubmit={handleDelete}>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Yes, Delete
        </button>
      </form>
    </div>
  );
}
