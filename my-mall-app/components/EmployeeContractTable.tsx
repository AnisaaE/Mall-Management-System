"use client";

import { useRouter } from "next/navigation";

export default function EmployeeContractTable({ contracts }: { contracts: any[] }) {
  const router = useRouter();

  const handleDelete = async (contract_id: number) => {
    const confirm = window.confirm("Bu sözleşmeyi silmek istiyor musunuz?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/employee-contracts/${contract_id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Sözleşme silindi ✅");
        router.refresh(); // sayfayı yeniden yükler
      } else {
        alert("Silme işlemi başarısız ❌");
      }
    } catch (error) {
      alert("Sunucu hatası oluştu.");
    }
  };

  return (
    <table className="w-full border text-sm text-center">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Employee</th>
          <th className="p-2 border">Start</th>
          <th className="p-2 border">End</th>
          <th className="p-2 border">Salary</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">İşlem</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((c) => (
          <tr key={c.contract_id} className="hover:bg-gray-50">
            <td className="p-2 border">{c.employee_name}</td>
            <td className="p-2 border">{c.start_date}</td>
            <td className="p-2 border">{c.end_date}</td>
            <td className="p-2 border">{c.salary} TL</td>
            <td className="p-2 border">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  c.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {c.is_active ? "Active" : "Expired"}
              </span>
            </td>
            <td className="p-2 border">
              <button
                onClick={() => handleDelete(c.contract_id)}
                className="text-red-600 hover:underline text-xs"
              >
                Sil
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
