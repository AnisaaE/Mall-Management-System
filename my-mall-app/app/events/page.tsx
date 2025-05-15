import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db/connection';
import Link from 'next/link';

type Event = {
  event_id: number;
  name: string;
};

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const events = await query<Event[]>(`
    SELECT event_id, name
    FROM event
    ORDER BY start_date DESC
  `);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {events.map((event) => (
          <Link
            key={event.event_id}
            href={`/events/${event.event_id}`}
            className="rounded-lg border border-gray-300 bg-white shadow hover:shadow-md transition duration-200 p-6 flex items-center justify-center text-center hover:bg-blue-50"
          >
            <span className="text-lg font-semibold text-blue-700">
              {event.name.length > 40
                ? `${event.name.slice(0, 40)}...`
                : event.name}
            </span>
          </Link>
        ))}

        {session?.user?.role === 'admin' && (
          <div className="flex items-center justify-center border border-dashed border-green-500 rounded p-4 hover:bg-green-50 transition">
            <Link
              href="/events/new"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
