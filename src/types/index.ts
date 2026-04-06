export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  department_id: number | null;
  created_at: string | null;
   intern?: {
    college: string;
  };
}

export interface Department {
  id: number;
  name: string;
}

export interface Intern {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: string;
  department_id: number | null;
  created_at: string | null;
  college: string;
  phone_number: string;
  start_date: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  department_id: number | null;
  college: string;
}
