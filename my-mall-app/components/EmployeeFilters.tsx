'use client';
import { useState, useEffect } from 'react';

type Props = {
  initialEmployees: any[];
};

export default function EmployeeFilters({ initialEmployees }: Props) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  const fetchEmployees = async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    const res = await fetch(`/api/employees?${params.toString()}`);
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, sort]);

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-4 py-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="asc">Name A-Z</option>
          <option value="desc">Name Z-A</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <a
            key={emp.employee_id}
            href={`/employees/${emp.employee_id}`}
            className="border p-4 rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">
              {emp.first_name} {emp.last_name}
            </h2>
            <p className="text-gray-600">{emp.position || 'No Position'}</p>
          </a>
        ))}
      </div>
    </>
  );
}
