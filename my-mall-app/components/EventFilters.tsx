'use client';

import { useState } from 'react';
import EventsGrid from './EventCard'; // ya da EventList, EventsGrid vs. sen ne kullandıysan
interface Event {
  event_id: number;
  name?: string;
  start_date: string;
  end_date: string;
  cost: number;
  description: string;
  
}

interface EventFiltersProps {
  initialEvents: Event[];
}

export default function EventFilters({ initialEvents }: EventFiltersProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'none',
  });

  const fetchFilteredEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.sort !== 'none') {
        params.set('sort', filters.sort);
      }

      const res = await fetch(`/api/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch filtered events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFilters({ ...filters, sort: 'asc' });
              fetchFilteredEvents();
            }}
            className={`px-3 py-1 rounded ${
              filters.sort === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            A-Z
          </button>
          <button
            onClick={() => {
              setFilters({ ...filters, sort: 'desc' });
              fetchFilteredEvents();
            }}
            className={`px-3 py-1 rounded ${
              filters.sort === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Z-A
          </button>
        </div>

        {/* Apply Button */}
        <button
          onClick={fetchFilteredEvents}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Applying...' : 'Apply Filters'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : (
        <EventsGrid events={events} />
      )}
    </div>
  );
}
