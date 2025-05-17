import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db/connection';
import Link from 'next/link';
import DeleteEventButton from '@/components/DeleteEventButton';
import { format } from 'date-fns';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Eğer event tablosunda shop_id yoksa JOIN KALDIR
  const sql = `
    SELECT 
      event_id,
      name,
      start_date,
      end_date,
      cost,
      description
    FROM event
    WHERE event_id = ?
  `;
  const results = await query(sql, [eventId]);

  if (results.length === 0) {
    return <div className="p-8 max-w-4xl mx-auto">The event was not found.</div>;
  }

  const event = results[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
            <div className="flex gap-4 mt-2 text-gray-600">
              <span>📅 Start: {format(new Date(event.start_date), 'dd.MM.yyyy')}</span>
              <span>⏳ End: {format(new Date(event.end_date), 'dd.MM.yyyy')}</span>
              <span>💰 Cost: {event.cost} TL</span>
            </div>
            <p className="mt-4 text-gray-700"><b>Description:</b> {event.description}</p>
          </div>

          {session.user.role === 'admin' && (
            <div className="flex gap-2">
              <Link
                href={`/events/${event.event_id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                 Edit
              </Link>
              <DeleteEventButton eventId={event.event_id.toString()} />
            </div>
          )}
        </div>
      </div>

      <div className="text-right">
        <Link href="/events" className="inline-block bg-green-600 text-white px-4 py-2 mt-6 rounded hover:bg-blue-700">← Back to Events</Link>
        
      </div>
    </div>
  );
}
