enum ProductAction {
  LIST = 'list',
  CREATE = 'create',
  UPDATE = 'update'
}

export type UserRole = 'admin' | 'staff' | 'manager';

// Interface standar sesuai format Backend yang kita buat
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Contoh interface untuk User
export interface User {
  id: string;
  name: string;
  role: UserRole;
  company_name?: string;
  token?: string;
}

// Interface untuk Payload Unified Format
export interface ApiPayload {
  action: string;
  data?: any;
}