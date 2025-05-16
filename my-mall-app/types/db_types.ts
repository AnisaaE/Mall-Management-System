export type Contract = {
  contract_id: number;
  shop_name?: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  manager_name: string;
  is_active: boolean;
  shop_id?: number;
  manager?: number;
  duration_id?: number;
  manager_mail?: string;
  manager_phone?: string;
  manager_address?: string;

};

export type Shop = {
  shop_id: number;
  name: string;
  floor: string;
  category: string;
};

export type Category = {
  category_id?: number;
  name: string;
};
export type Payment = {
  payment_id: number;
  contract_id: number;
  amount: number;
  payment_date: string; // or Date
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  payment_method: 'Cash' | 'Card' | 'Bank Transfer' | 'Online';
};

export type AuthUser = {
  name: string;
  role: string;
};

export type Employee = {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  position_id: number;
  position?: string;
};

export type EmployeeContract = {
  contract_id?: number;
  last_name?: string;
  start_date: string;
  end_date: string;
  salary?: number;
  first_name?: string;
  is_active?: boolean;
  employee_id?: number;
  duration_id?: number;

};

export type Position= {
  position_id:number;
  position_name:string;
};

export type Event = {
  event_id:number;
  start_date:string;
  end_date:string;
  cost:number;
  description:string;
  name:string;
};


export type Salary = {
  contract_id: number;
  employee_name: string;
  start_date: string;
  end_date:string;
  salary: number;
};

export type Supplier = {
  supplier_id: number;
  name: string;
};


export type Expenses = {
  expense_id: number;
  amount: number;
  date: string;
  description: string | null;
  title: string | null;
  expense_type_name: string | null;
};