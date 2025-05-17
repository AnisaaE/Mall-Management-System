'use client';

import Link from 'next/link';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import {Event} from '@/types/db_types'


export default function EventsGrid({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No events to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link
          key={event.event_id}
          href={`/events/${event.event_id}`}
          className="block border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative group bg-white"
        >
          {/* Heroicon – Calendar icon */}
          <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity">
            <CalendarDaysIcon className="h-30 w-30 text-indigo-950" />
          </div>

          {/* İçerik */}
          <div className="pr-16">
            <h2 className="font-bold text-lg relative z-10">
              {event.name}
            </h2>
            <p className="text-gray-600 mt-2 relative z-10">
              Start: {event.start_date ? format(new Date(event.start_date), 'dd.MM.yyyy') : 'N/A'}
            </p>
            <p className="text-gray-600 relative z-10">
              End: {event.end_date ? format(new Date(event.end_date), 'dd.MM.yyyy') : 'N/A'}
            </p>
            <p className="text-gray-600 relative z-10">
              Cost: {event.cost} TL
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
