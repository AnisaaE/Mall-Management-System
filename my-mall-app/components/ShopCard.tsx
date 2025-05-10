'use client';

import Link from "next/link";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export interface Shop {
  shop_id: number;
  name: string;
  floor: string;
  category: string;
}

export default function ShopCard({ shops }: { shops: Shop[] }) {
  if (shops.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No shops to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <Link
          key={shop.shop_id}
          href={`/shops/${shop.shop_id}`}
          className="block border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative group bg-white"
        >
          {/* Голяма Heroicons икона с цвят като заглавието */}
          <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity">
            <BuildingStorefrontIcon className="h-30 w-30  text-indigo-950 " />
          </div>

          {/* Съдържание */}
          <div className="pr-16">
            <h2 className="font-bold text-lg relative z-10">
              {shop.name}
            </h2>
            <p className="text-gray-600 mt-2 relative z-10">Floor: {shop.floor}</p>
            <p className="text-gray-600 relative z-10">Category: {shop.category}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}