"use client";

import { useState } from "react";

export default function EmployeeContractForm({ employees, durations }: { employees: any[]; durations: any[] }) {
  const [salary, setSalary] = useState("");

  return (
    <form action="/employee-contracts/api" method="POST" className="space-y-4">
      <div>
        <label>Çalışan:</label>
        <select name="employee_id" className="w-full border p-2" required>
          {employees.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Süre:</label>
        <select name="duration_id" className="w-full border p-2" required>
          {durations.map((d) => (
            <option key={d.duration_id} value={d.duration_id}>
              {d.start_date} - {d.end_date}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Maaş:</label>
        <input
          type="number"
          name="salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Kaydet
      </button>
    </form>
  );
}

