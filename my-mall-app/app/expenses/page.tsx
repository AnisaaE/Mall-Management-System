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



      alert("Paid işlem başarılı");
    } else {
      alert("Paid işleminde hata oldu");
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
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
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
                <td className="border p-2">{event.start_date}</td>
                <td className="border p-2">{event.end_date || "-"}</td>
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
  <table className="w-full border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">Employee</th>
        <th className="border p-2">Amount</th>
        <th className="border p-2">Start Date</th>
        <th className="border p-2">End Date</th>
        <th className="border p-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {salaries.length === 0 ? (
        <tr>
          <td colSpan={4} className="text-center p-4">
            No unpaid salaries
          </td>
        </tr>
      ) : (
        salaries.map((salary) => (
          <tr key={salary.contract_id}>
            <td className="border p-2">{salary.employee_name}</td>
            <td className="border p-2">{salary.salary}</td>
            <td className="border p-2">{salary.start_date}</td>
            <td className="border p-2">{salary.end_date}</td>
            <td className="border p-2 text-center">
              <button
                onClick={() => handlePay("salaries", salary.contract_id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Pay
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</section>




      <section>
        <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center p-4">
                  No suppliers
                </td>
              </tr>
            )}
            {suppliers.map((supplier) => (
              <tr key={supplier.supplier_id}>
                <td className="border p-2">{supplier.name}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handlePay("suppliers", supplier.supplier_id)}
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
        <h2 className="text-xl font-semibold mb-4">Paid Expenses</h2>
        {paidExpenses.length === 0 ? (
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
              {paidExpenses.map((exp) => (
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
}
