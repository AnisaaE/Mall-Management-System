import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db/connection';
import { format } from 'date-fns';
import Link from 'next/link';

type Event = {
  event_id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  cost: number | string | null;
  description: string;
};

// 💡 Veriyi bileşen dışında çekiyoruz
async function getEvent(eventId: string): Promise<Event | null> {
  const results = await query<any[]>(
    `SELECT * FROM event WHERE event_id = ?`,
    [eventId]
  );

  if (results.length === 0) return null;

  const raw = results[0];
  return {
    ...raw,
    start_date: new Date(raw.start_date),
    end_date: new Date(raw.end_date),
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const event = await getEvent(params.eventId);
  if (!event) {
    return <div className="p-8 max-w-4xl mx-auto">Event not found.</div>;
  }

  return (
    <>
      {/* Detay Kartı */}
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">{event.name}</h1>
          <div className="space-y-3 text-gray-800">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{format(event.start_date, 'dd.MM.yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{format(event.end_date, 'dd.MM.yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cost</p>
              <p className="font-medium text-green-700">
                {event.cost ? `${Number(event.cost).toFixed(2)} TL` : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔙 Kart altı, sağ hizalı buton */}
      <div className="mt-4 flex justify-end max-w-4xl mx-auto px-8">
        <Link
          href="/events"
          className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition"
        >
          ← Back to Events
        </Link>
      </div>
    </>
  );
}


