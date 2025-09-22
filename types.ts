export enum Role {
  Patient = 'Patient',
  Doctor = 'Doctor',
  Admin = 'Admin',
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Doctor extends User {
  specialty: string;
  fee: number;
  approved: boolean;
  experience: number;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  apptTime: Date;
  notes: string;
  status: AppointmentStatus;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'model';
  text: string;
}