// app/shops/[shopId]/edit/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { redirect } from 'next/navigation';
import EditForm from '@/components/EditForm';

type Shop = {
  shop_id: number;
  name: string;
  floor: string;
  category: string;
};

export default async function EditShopPage({
  params,
}: {
  params: { shopId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/login');
  if (session.user.role !== 'manager') redirect('/unauthorized');

  const shopId = params.shopId;

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

  return <EditForm shop={results[0]} />;
}
