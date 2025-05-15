'use client';
import { useState ,useEffect} from 'react';
import { useRouter } from 'next/navigation';

type Employee = {
  employee_id: number;
  first_name: string;
  last_name: string;
  position_id: number;
};

type Position = {
  position_id: number;
  position_name: string;
};

export default function EditEmployeeForm({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(employee.first_name);
  const [lastName, setLastName] = useState(employee.last_name);
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionId, setPositionId] = useState(employee.position_id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    useEffect(() => {
    const fetchPositions = async () => {
      const res = await fetch('/api/positions');
      const data = await res.json();
      setPositions(data);
    };
    fetchPositions();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch(`/api/employees/${employee.employee_id}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        position_id:positionId,
      }),
    });

    if (res.ok) {
      router.push(`/employees/${employee.employee_id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update employee');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Position:</label>
          <select
            value={positionId}
            onChange={(e) => setPositionId(Number(e.target.value))}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Position</option>
            {positions.map((pos) => (
              <option key={pos.position_id} value={pos.position_id}>
                {pos.position_name}
              </option>
            ))}
          </select>
        </div>
      
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
