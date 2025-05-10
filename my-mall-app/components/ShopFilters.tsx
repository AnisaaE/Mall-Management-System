'use client';

import { useState } from 'react';
import ShopsGrid from './ShopCard';
interface Shop {
    shop_id: number;
    name: string;
    floor: string;
    category: string;
}


interface ShopFiltersProps {
  initialShops: Shop[];
  categories: string[];
}

export default function ShopFilters({ 
  initialShops, 
  categories 
}: ShopFiltersProps) {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    sort: 'none'
  });

  const fetchFilteredShops = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.category !== 'All') {
        params.set('category', filters.category);
      }
      if (filters.sort !== 'none') {
        params.set('sort', filters.sort);
      }

      const res = await fetch(`/api/shops?${params.toString()}`);
      
      if (res.ok) {
        const data = await res.json();
        setShops(data);
      }
    } catch (error) {
      console.error('Failed to fetch filtered shops:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        <div className="min-w-[200px]">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="w-full p-2 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFilters({...filters, sort: 'asc'});
              fetchFilteredShops();
            }}
            className={`px-3 py-1 rounded ${
              filters.sort === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            A-Z
          </button>
          <button
            onClick={() => {
              setFilters({...filters, sort: 'desc'});
              fetchFilteredShops();
            }}
            className={`px-3 py-1 rounded ${
              filters.sort === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Z-A
          </button>
        </div>

        {/* Apply Button */}
        <button
          onClick={fetchFilteredShops}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Applying...' : 'Apply Filters'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading shops...</div>
      ) : (
        <ShopsGrid shops={shops} />
      )}
    </div>
  );
}