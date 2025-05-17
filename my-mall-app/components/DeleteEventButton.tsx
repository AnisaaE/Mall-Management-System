'use client';

import { useRouter } from 'next/navigation';

export default function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm('Delete this event?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) router.push('/events');
    else alert('Delete failed');
  };

  return (
    <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 text-sm">
       Delete
    </button>
  );
}
