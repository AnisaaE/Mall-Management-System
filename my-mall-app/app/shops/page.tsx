// app/shops/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import ShopCard from '@/components/ShopCard';
import { redirect } from 'next/navigation';

export default async function ShopsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) redirect('/login');

  let sql = `
    SELECT s.shop_id, s.name, s.floor, c.name AS category
    FROM shop s
    JOIN category c ON s.category_id = c.category_id
  `;
  const params: any[] = [];

  if (session.user.role === 'manager') {
    sql += `
      JOIN shop_contract sc ON sc.shop_id = s.shop_id
      JOIN manager m ON sc.manager_id = m.manager_id
      WHERE m.username = ?
    `;
    console.log(session.user);
    params.push(session.user.username);
  }

  const shops = await query<{ shop_id: number; name: string; floor: string; category: string }[]>(sql, params);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        {session.user.role === 'manager' ? 'Your Shops' : 'All Shops'}
      </h1>
      <ShopCard shops={shops} />
    </div>
  );
}
