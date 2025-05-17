'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EventForm({ event, method = 'POST' }: { event?: any; method?: 'POST' | 'PUT' }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: event?.name || '',
    start_date: event?.start_date?.slice(0, 10) || '',
    end_date: event?.end_date?.slice(0, 10) || '',
    cost: event?.cost || '',
    description: event?.description || '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      method === 'PUT' ? `/api/events/${event.event_id}` : `/api/events`,
      {
        method,
        body: JSON.stringify({
          ...form,
          cost: parseFloat(form.cost).toFixed(2),
        }),
      }
    );

    if (res.ok) {
      router.push('/events');
    } else {
      alert('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
      <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <input type="number" name="cost" value={form.cost} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{method === 'PUT' ? 'Update' : 'Create'}</button>
    </form>
  );
}
