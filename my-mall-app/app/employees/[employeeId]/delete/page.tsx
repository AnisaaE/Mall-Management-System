'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DeleteEmployeePage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const [employee, setEmployee] = useState<any>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployeeId = async () => {
      const { employeeId } = await params;
      setEmployeeId(employeeId);
    };

    fetchEmployeeId();
  }, [params]);

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployeeDetails = async () => {
      const res = await fetch(`/api/employees/${employeeId}`);
      if (res.ok) {
        const data = await res.json();
        setEmployee(data);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/employees/${employeeId}`, {
      method: 'POST',
    });

    if (res.ok) {
      alert('The employee has been deleted!');
      router.push('/employees');
    } else {
      alert('The employee cannot be deleted, possibly due to active contracts.');
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Delete Employee</h1>
      <p className="mb-2">
        Are you sure you want to delete employee{' '}
        <strong>{employee.first_name} {employee.last_name}</strong>?
      </p>
      <form onSubmit={handleDelete}>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Yes, Delete
        </button>
      </form>
    </div>
  );
}
