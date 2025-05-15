import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db/connection';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Employee, Contract, EmployeeContract } from '@/types/db_types';
import DeleteEmployeeButton from '@/components/DeleteEmployeeButton';

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const employeeSql = `
    SELECT e.employee_id, e.name AS first_name, e.surname AS last_name, p.position_name AS position
    FROM employee e
    JOIN positions p ON e.position_id = p.position_id
    WHERE e.employee_id = ?
  `;
  const results = await query<Employee[]>(employeeSql, [employeeId]);

  const contractSql = `
    SELECT * FROM active_employee_contracts
    WHERE employee_id = ?
  `;
  const activeContracts = await query<EmployeeContract[]>(contractSql, [employeeId]);

  if (results.length === 0) {
    return <div className="p-8 max-w-4xl mx-auto">The employee was not found.</div>;
  }

  const employee = results[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {employee.first_name} {employee.last_name}
            </h1>
            <div className="flex gap-4 mt-2 text-gray-600">
              <span>Position: {employee.position}</span>
            </div>
          </div>

          {session.user.role === 'admin' && (
            <div className="flex gap-2">
              <a
                href={`/employees/${employee.employee_id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </a>
              <DeleteEmployeeButton employeeId={employee.employee_id} />
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Active Contracts
          </h2>

          {activeContracts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              No active contracts
            </div>
          ) : (
            <div className="space-y-3">
              {activeContracts.map((contract) => (
                <div key={contract.contract_id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start date</p>
                      <p className="font-medium">{format(contract.start_date, 'dd.MM.yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End date</p>
                      <p className="font-medium">{format(contract.end_date, 'dd.MM.yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium">{contract.salary} TL</p>
                    </div>
                  </div>
                  {contract.first_name && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Shop</p>
                      <p className="font-medium">{contract.first_name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

