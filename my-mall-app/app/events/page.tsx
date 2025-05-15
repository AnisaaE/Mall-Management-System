import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db/connection';
import { Event } from '@/types/db_types';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Fetch all events
  const events = await query<Event[]>(`
    SELECT event_id, start_date, end_date, cost, description
    FROM event
    ORDER BY start_date DESC
  `);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Events</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {events.map(event => (
          <div key={event.event_id} className="border border-gray-300 p-4 rounded shadow hover:shadow-lg transition">
            <p className="text-sm text-gray-600">
              {new Date(event.start_date).toLocaleDateString()} → {new Date(event.end_date).toLocaleDateString()}
            </p>
            <p className="mt-2 text-lg font-semibold text-green-700">${event.cost}</p>
            <p className="mt-2 text-gray-800 whitespace-pre-line">{event.description}</p>
          </div>
        ))}
      </div>

      {session.user.role === 'admin' && (
        <a
          href="/events/new"
          className="inline-block bg-green-600 text-white px-4 py-2 mt-8 rounded hover:bg-green-700"
        >
          + Add Event
        </a>
      )}
    </div>
  );
}
