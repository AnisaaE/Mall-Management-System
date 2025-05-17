import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import EventFilters from '@/components/EventFilters';
import { query } from '@/lib/db/connection';
import { Event } from '@/types/db_types';

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    start_date?: string;
    end_date?: string;
    sort?: 'newest' | 'oldest' | 'cheapest' | 'expensive';
  };
}) 
{
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const { search, start_date, end_date, sort } = searchParams || {};

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

  // Филтър за мениджъри (само техните събития)
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

  // Търсене по име (ако има)
  if (search) {
    sql += params.length ? ' AND ' : ' WHERE ';
    sql += 'e.name LIKE ?';
    params.push(`%${search}%`);
  }

  // Филтър по дата (ако е избран период)
  if (start_date) {
    sql += params.length ? ' AND ' : ' WHERE ';
    sql += 'e.start_date >= ?';
    params.push(start_date);
  }
  if (end_date) {
    sql += params.length ? ' AND ' : ' WHERE ';
    sql += 'e.end_date <= ?';
    params.push(end_date);
  }

  // Подреждане (default: най-скорошни първи)
  switch (sort) {
    case 'oldest':
      sql += ' ORDER BY e.start_date ASC';
      break;
    case 'cheapest':
      sql += ' ORDER BY e.cost ASC';
      break;
    case 'expensive':
      sql += ' ORDER BY e.cost DESC';
      break;
    default: // 'newest' или няма зададен сортиращ параметър
      sql += ' ORDER BY e.start_date DESC';
  }

  const events = await query<Event[]>(sql, params);

  return (
   <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          {session.user.role === 'manager' ? 'Your Events' : 'All Events'}
        </h1>
        {session.user.role === 'admin' && (
          <a
            href="/events/new"
            className="bg-green-600 text-white px-3 py-1.5 text-sm rounded hover:bg-green-700"
          >
            + Add Event
          </a>
        )}
      </div>

      {/* Компактна форма за филтри */}
      <div className="mb-4 bg-white p-3 rounded-lg shadow-sm">
        <form className="flex flex-col sm:flex-row gap-2 items-end">
          {/* Търсене по име - остава първо, но по-компактно */}
          <div className="flex-1 min-w-[150px]">
            <input
              type="text"
              name="search"
              placeholder="Search events..."
              defaultValue={search}
              className="w-full p-1.5 text-sm border rounded"
            />
          </div>

          {/* Дати в един ред на малки екрани */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex-1 min-w-[120px]">
              <input
                type="date"
                name="start_date"
                defaultValue={start_date}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <input
                type="date"
                name="end_date"
                defaultValue={end_date}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
          </div>

          {/* Подреждане - компактно dropdown */}
          <div className="w-full sm:w-[180px]">
            <select
              name="sort"
              defaultValue={sort || 'newest'}
              className="w-full p-1.5 text-sm border rounded"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="cheapest">Cheapest first</option>
              <option value="expensive">Most expensive</option>
            </select>
          </div>

          {/* Бутонът сега е по-малък */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-700 whitespace-nowrap"
          >
            Apply
          </button>
        </form>
      </div>

      <EventFilters initialEvents={events} />

      {session.user.role === 'admin' && (
        <a
          href="/events/new"
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
        >
          + Add Event
        </a>
      )}
    </div>
  );
}