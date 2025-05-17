"use client";

import React, { useEffect, useState } from "react";
import { Event } from '@/types/db_types';
import { Salary } from '@/types/db_types';
import { Supplier } from '@/types/db_types';
import { Expenses } from '@/types/db_types';


type PaidExpense = Expenses; 

export default function ExpensesPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [paidExpenses, setPaidExpenses] = useState<PaidExpense[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Salary | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [amount, setAmount] = useState<number>(0);


  // Verileri yükle
  const fetchData = async () => {
    const res = await fetch("/api/expenses");
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events || []);
      setSalaries(data.salaries || []);
      setSuppliers(data.suppliers || []);
      setExpenses(data.expenses || []);
      setPaidExpenses(data.paidExpenses || []);

    }

    console.log(expenses);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pay butonuna basıldığında çağrılır
  const handlePay = async (type: "events" | "suppliers" | "expenses" | "salaries", id: number) => {
    
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });

    if (res.ok) {
      // Başarılıysa ilgili listedeki itemi kaldırıp paidExpenses listesine ekle (demo olarak sadece kaldırıyoruz)
      if (type === "events") {
        setEvents((prev) => prev.filter((e) => e.event_id !== id));
      } else if (type === "suppliers") {
        setSuppliers((prev) => prev.filter((s) => s.supplier_id !== id));
      } else if (type === "expenses") {
        setExpenses((prev) => prev.filter((e) => e.expense_id !== id));
      }else if (type === "salaries") {
      setSalaries((prev) => prev.filter((s) => s.contract_id !== id));
    }



      alert("Paid is successful");
    } else {
      alert("Paid is failed");
    }
  };

  const handleSupplierPay = async () => {
  if (!selectedSupplier || !amount) {
    alert("Please select supplier and enter amount");
    return;
  }
console.log(selectedSupplier.supplier_id)
  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "suppliers",
      supplier_id: selectedSupplier.supplier_id,
      amount,
      name: selectedSupplier.name
    }),
  });

  if (res.ok) {
    const data = await res.json();
    if (data.paidExpense) {
      setPaidExpenses((prev) => [...prev, data.paidExpense]);
    }
    setSelectedSupplier(null);
    setAmount(0);
    alert("Paid successfully");
  } else {
    alert("Payment failed");
  }
};

const handleEmployeePay = async () => {
  if (!selectedEmployee) {
    alert("Please select an employee");
    return;
  }

  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "salaries",
      id: selectedEmployee.contract_id,
      name: selectedEmployee.employee_name,
      amount: selectedEmployee.salary
    }),
  });

  if (res.ok) {
    const data = await res.json();
    if (data.paidExpense) {
      setPaidExpenses((prev) => [...prev, data.paidExpense]);
    }
    setSelectedEmployee(null);
    alert("Salary paid successfully");
  } else {
    alert("Payment failed");
  }
};

  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Events</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Creation Date</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No unpaid events
                </td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.event_id}>
                <td className="border p-2">{event.name}</td>
                <td className="border p-2">{event.date}</td>
                <td className="border p-2">{event.cost ?? "-"}</td>
                <td className="border p-2">{event.description || "-"}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handlePay("events", event.event_id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

<section>
  <h2 className="text-xl font-semibold mb-4">Salaries</h2>

  {/* Employee Dropdown */}
  <div className="mb-4">
    <label className="block font-medium mb-1">Select Employee</label>
    <select
      className="w-full p-2 border rounded"
      value={selectedEmployee?.contract_id || ""}
      onChange={(e) => {
        const contractId = Number(e.target.value);
        const employee = salaries.find((s) => s.contract_id === contractId);
        setSelectedEmployee(employee || null);
      }}
    >
      <option value="">-- Select Employee --</option>
      {salaries.map((salary) => (
        <option key={salary.contract_id} value={salary.contract_id}>
          {salary.employee_name}
        </option>
      ))}
    </select>
  </div>

  {/* Salary Display */}
  {selectedEmployee && (
    <div className="mb-4">
      <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
      <p><strong>Start Date:</strong> {selectedEmployee.start_date}</p>
      <p><strong>End Date:</strong> {selectedEmployee.end_date}</p>
      <button
        onClick={handleEmployeePay}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
      >
        Pay
      </button>
    </div>
  )}
</section>

      <section>
  <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
  {suppliers.length === 0 ? (
    <div className="italic text-gray-500">No suppliers found</div>
  ) : (
    <div className="space-y-4">
      <select
        className="border p-2 rounded w-full max-w-sm"
        onChange={(e) => {
          const selectedId = parseInt(e.target.value);
          const selectedSupplier = suppliers.find(s => s.supplier_id === selectedId);
          if (selectedSupplier) {
            setSelectedSupplier(selectedSupplier);
          } else {
            setSelectedSupplier(null);
          }
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Select a supplier
        </option>
        {suppliers.map((s) => (
          <option key={s.supplier_id} value={s.supplier_id}>
            {s.name}
          </option>
        ))}
      </select>

      {selectedSupplier && (
        <div className="space-y-2">
          <p><strong>Supplier:</strong> {selectedSupplier.name}</p>
          <input
            type="number"
            placeholder="Enter amount"
            className="border p-2 rounded w-full max-w-sm"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
          <button
            onClick={handleSupplierPay}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pay
          </button>
        </div>
      )}
    </div>
  )}
</section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Paid Expenses</h2>
        {expenses.length === 0 ? (
          <div className="italic text-gray-500">No paid expenses yet.</div>
        ) : (
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Title</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Expense Type</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.expense_id}>
                  <td className="border p-2">{exp.title || "-"}</td>
                  <td className="border p-2">{exp.amount}</td>
                  <td className="border p-2">{exp.date}</td>
                  <td className="border p-2">{exp.description || "-"}</td>
                  <td className="border p-2">{exp.expense_type_name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

