export interface User {
  _id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  occupation: 'Student' | 'Engineer' | 'Teacher' | 'Unemployed';
  phone: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  occupation: 'Student' | 'Engineer' | 'Teacher' | 'Unemployed';
  phone: string;
  image?: File | null;
}

export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  total: number;
}