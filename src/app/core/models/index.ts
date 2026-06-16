export type LeaveStatus = 'approved' | 'pending' | 'rejected';
export type LeaveType   = 'sick' | 'annual' | 'personal' | 'maternity' | 'other';
export type UserRole    = 'admin' | 'employee';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  position: string;
  department: string;
  role: UserRole;
  isActive: boolean;
}

export interface LeaveBalance {
  leaveType: LeaveType;
  label: string;
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveRequest {
  id: string;
  employee: User;
  leaveType: LeaveType;
  leaveTypeLabel: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  createdAt: Date;
  reviewedBy?: User;
  reviewedAt?: Date;
  rejectReason?: string;
}
