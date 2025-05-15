import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { query } from "@/lib/db/connection";
import { redirect } from "next/navigation";
import Link from "next/link";
import EmployeeContractTable from "@/components/EmployeeContractTable";

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

      {session.user.role === "admin" && (
        <Link
          href="/employee-contracts/add"
          className="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-700"
        >
          Yeni Sözleşme Ekle
        </Link>
      )}

      <EmployeeContractTable contracts={employeeContracts} />
    </div>
  );
}
