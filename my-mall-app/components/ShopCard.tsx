// components/ShopCard.tsx
// app/shops/components/ShopCard.tsx
import React from "react";

type ShopCardProps = {
  name: string;
  floor: string;
  category: string;
};

export default function ShopCard({ name, floor, category }: ShopCardProps) {
  return (
    <div className="border p-4 rounded-xl shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">Floor: {floor}</p>
      <p className="text-gray-500">Category: {category}</p>
    </div>
  );
}
