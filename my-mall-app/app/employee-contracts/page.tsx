import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { query } from "@/lib/db/connection";
import { redirect } from "next/navigation";

export default async function EmployeeContractsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const employeeContracts = await query<any[]>(`
    SELECT 
      ec.employee_contract AS contract_id,
      e.name AS employee_name,
      DATE_FORMAT(d.start_date, '%d.%m.%Y') AS start_date,
      DATE_FORMAT(d.end_date, '%d.%m.%Y') AS end_date,
      ec.salary,
      CURDATE() BETWEEN d.start_date AND d.end_date AS is_active
    FROM employee_contract ec
    JOIN employee e ON ec.employee_id = e.employee_id
    JOIN duration d ON ec.duration_id = d.duration_id
    ORDER BY d.end_date DESC
  `);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Contracts</h1>

      <table className="w-full border text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Salary</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {employeeContracts.map((c) => (
            <tr key={c.contract_id} className="hover:bg-gray-50">
              <td className="p-2 border">{c.employee_name}</td>
              <td className="p-2 border">{c.start_date}</td>
              <td className="p-2 border">{c.end_date}</td>
              <td className="p-2 border">{c.salary} TL</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    c.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.is_active ? "Active" : "Expired"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
