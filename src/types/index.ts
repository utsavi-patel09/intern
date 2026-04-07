export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  created_at: string | null;
  intern?: {
    college: string;
    gender?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    stipend?: number | null;
  };
  department_id?: number | null;
  managers?: {
    department: {
      id: number;
    } | null;
  }[];
}

export interface Department {
  id: number;
  name: string;
}

export interface Manager {
  id: number;
  user_id: number;
  department_id: number | null;
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
  gender?: string | null;
  end_date?: string | null;
  stipend?: number | null;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  department_id: number | null;
  college: string;
  gender?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  stipend?: number | string | null;
}
