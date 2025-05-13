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
  name: string;
  surname: string;
  position_name?: string;
};
