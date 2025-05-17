'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId?.toString();

  const [form, setForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    cost: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();

        setForm({
          name: data.name,
          start_date: new Date(data.start_date).toISOString().slice(0, 10),
          end_date: new Date(data.end_date).toISOString().slice(0, 10),
          cost: data.cost,
          description: data.description,
        });
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        alert('Etkinlik alınamadı.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...form,
        cost: parseFloat(form.cost).toFixed(2),
      }),
    });

    if (res.ok) {
      alert('Event updated');
      router.push('/events');
    } else {
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6">
      <input name="name" value={form.name} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <input name="start_date" type="date" value={form.start_date} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <input name="end_date" type="date" value={form.end_date} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <input name="cost" type="number" value={form.cost} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Update</button>
    </form>
  );
}

