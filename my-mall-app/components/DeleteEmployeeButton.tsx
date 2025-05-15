'use client';

import { useRouter } from 'next/navigation';

type Props = {
  employeeId: number;
};

export default function DeleteEmployeeButton({ employeeId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Employee deleted successfully.');
        router.refresh(); // or router.push('/employees') to go to employee list
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to delete employee.');
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Delete
    </button>
  );
}
