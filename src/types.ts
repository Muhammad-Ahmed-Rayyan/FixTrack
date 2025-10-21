export interface UserData {
  name: string;
  email: string;
  phone?: string;
  cnic?: string;
  address?: string;
  isAdmin?: boolean;
  role?: 'admin' | 'road' | 'electric' | 'water' | 'gas' | 'power' | 'sanitation' | 'infrastructure' | 'waste' | 'traffic' | 'emergency';
}
