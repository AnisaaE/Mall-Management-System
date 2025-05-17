"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ bunu ekle

export default function EmployeeContractForm({ employees }: { employees: any[] }) {
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // ✅ hook'u tanımla

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("employee_id", employeeId);
      formData.append("start_date", startDate);
      formData.append("end_date", endDate);
      formData.append("salary", salary);

      const res = await fetch("/api/employee-contracts", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ Contract added.");
        setEmployeeId("");
        setStartDate("");
        setEndDate("");
        setSalary("");
        // ✅ doğru yönlendirme burada
        router.push("/employee-contracts");
      } else {
        const data = await res.json();
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      setMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Employee:</label>
        <select
          name="employee_id"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full border p-2"
          required
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="start_date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="end_date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Salary:</label>
        <input
          type="number"
          name="salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>

      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
      
      
    </form>
  );
}
