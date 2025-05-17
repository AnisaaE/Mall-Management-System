import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import EventFilters from '@/components/EventFilters';
import { query } from '@/lib/db/connection';
import { Event } from '@/types/db_types';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  let sql = `
    SELECT 
      e.event_id, 
      e.name,
      e.start_date,
      e.end_date,
      e.cost,
      e.description
    FROM event e
  `;
  const params: any[] = [];

  if (session.user.role === 'manager') {
    sql += `
      WHERE e.shop_id IN (
        SELECT s.shop_id
        FROM shop s
        JOIN shop_contract sc ON sc.shop_id = s.shop_id
        JOIN manager m ON sc.manager_id = m.manager_id
        WHERE m.username = ?
      )
    `;
    params.push(session.user.username);
  }

  sql += ' ORDER BY e.start_date DESC';

  const events = await query<Event[]>(sql, params);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        {session.user.role === 'manager' ? 'Your Events' : 'All Events'}
      </h1>
      <></>
      <EventFilters initialEvents={events} />
      {session.user.role === 'admin' && (
        <a
          href="/events/new"
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-green-700"
        >
          + Add Event
        </a>
      )}
    </div>
  );
}
