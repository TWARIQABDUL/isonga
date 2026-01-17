export interface User {
  id: number;
  idNumber: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  cell: string;
  role: 'ADMIN' | 'USER' | 'AGENT';
  createdAt: string;
  accountNotificationSent: boolean;
}
