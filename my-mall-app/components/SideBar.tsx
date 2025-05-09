'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  BuildingStorefrontIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Пълна навигация за админи
  const adminNavItems = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Shops", href: "/shops", icon: BuildingStorefrontIcon },
    { name: "Employees", href: "/employees", icon: UserGroupIcon },
    { name: "Shop Contracts", href: "/shop-contracts", icon: DocumentTextIcon },
    { name: "Employee Contracts", href: "/employee-contracts", icon: DocumentTextIcon },
    { name: "Payments", href: "/payments", icon: CreditCardIcon },
    { name: "Events", href: "/events", icon: CalendarIcon },
    { name: "Expenses", href: "/expenses", icon: CurrencyDollarIcon },
  ];

  // Ограничена навигация за мениджъри
  const managerNavItems = [
    { name: "Shops", href: "/shops", icon: BuildingStorefrontIcon },
    { name: "Shop Contracts", href: "/shop-contracts", icon: DocumentTextIcon },
    { name: "Payments", href: "/payments", icon: CreditCardIcon },
  ];

  // Избираме коя навигация да показваме според ролята
  const navItems = session?.user?.role === 'manager' ? managerNavItems : adminNavItems;

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">Mall Management System</h1>
        <p className="text-xs text-gray-500 mt-1">
           ({session?.user?.role})
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg group ${
                isActive
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 group"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-600" />
          Logout
        </button>
      </div>
    </div>
  );
}