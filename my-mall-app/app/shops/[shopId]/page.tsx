import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { redirect } from 'next/navigation';
import DeleteShopButton from '@/components/DeleteShopButton';

type Shop = {
  shop_id: number;
  name: string;
  floor: string;
  category: string;
};

export default async function ShopDetailPage({params,}: {params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const sql = `
    SELECT s.shop_id, s.name, s.floor, c.name AS category
    FROM shop s
    JOIN category c ON s.category_id = c.category_id
    WHERE s.shop_id = ?
  `;
  const results = await query<Shop[]>(sql, [shopId]);

  if (results.length === 0) {
    return <div className="p-8">Shop not found.</div>;
  }
  const shop = results[0];

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
        <p className="mb-2">Floor: {shop.floor}</p>
        <p className="mb-6">Category: {shop.category}</p>
      </div>

      {session.user.role === 'admin' && (
        <div className="flex gap-4 mt-6 px-8">
          <a
            href={`/shops/${shop.shop_id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </a>

          <DeleteShopButton shopId={shop.shop_id} />
        </div>
      )}
    </>
  );
}
