"use client";

import React, { useEffect, useState } from "react";

type User = {
  username: string;
  role: string;
};

type Manager = {
  manager_id: number;
  name: string;
  email?: string;
  phone?: string;
};

type Accountant = {
  employee_id: number;
  name: string;
  surname: string;
  position: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
  const [selectedAccountant, setSelectedAccountant] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setManagers(data.managers || []);
        setAccountants(data.accountants || []);
        console.log(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role,
          managerId: role === "manager" ? selectedManager : null,
          employeeId: role === "accountant" ? selectedAccountant : null
        }),
      });

      if (res.ok) {
        alert("User created successfully");
        setUsername("");
        setPassword("");
        setSelectedManager(null);
        setSelectedAccountant(null);
        fetchData();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to create user");
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    try {
        setUsers(prevUsers => prevUsers.filter(user => user.username !== username));
        const res = await fetch("/api/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        if (res.ok) {
            alert("User deleted successfully");
            fetchData(); // Refresh the list
        } else {
            const error = await res.json();
            alert(`User deleted!`);
        }
    } catch (error) {
            alert("User deleted successfully");
    }
};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">User Management</h1>
      
      {/* Create User Form */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSelectedManager(null);
                setSelectedAccountant(null);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="accountant">Accountant</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          
          {/* Manager selection (only shown when role is manager) */}
          {role === "manager" && managers.length > 0 && (
            <div>
              <label className="block font-medium">Assign to Manager</label>
              <select
                value={selectedManager || ""}
                onChange={(e) => setSelectedManager(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select Manager --</option>
                {managers.map((manager) => (
                  <option key={manager.manager_id} value={manager.manager_id}>
                    {manager.name} ({manager.email})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Accountant selection (only shown when role is accountant) */}
          {role === "accountant" && accountants.length > 0 && (
            <div>
              <label className="block font-medium">Assign to Accountant</label>
              <select
                value={selectedAccountant || ""}
                onChange={(e) => setSelectedAccountant(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select Accountant --</option>
                {accountants.map((acc) => (
                  <option key={acc.employee_id} value={acc.employee_id}>
                    {acc.name} {acc.surname} ({acc.position})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create User
          </button>
        </form>
      </section>
      
      {/* Users List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
         <table className="w-full border border-gray-300">
    <thead>
        <tr className="bg-gray-100">
            <th className="border p-2">Username</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
        </tr>
    </thead>
    <tbody>
        {users.map((user) => (
            <tr key={user.username}>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2 capitalize">{user.role}</td>
                <td className="border p-2 text-center">
                    <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>
        )}
      </section>
    </div>
  );
}
