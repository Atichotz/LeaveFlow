import { computed, inject, Injectable, signal } from '@angular/core';
import { LeaveBalance, LeaveRequest, LeaveStatus, LeaveType } from '../models';
import { MOCK_LEAVE_REQUESTS } from '../mock/leave-requests.mock';
import { MOCK_LEAVE_BALANCES_MAP } from '../mock/leave-balances.mock';
import { AuthService } from './auth.service';

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  sick:      'ลาป่วย',
  annual:    'ลาพักร้อน',
  personal:  'ลากิจ',
  maternity: 'ลาคลอด',
  other:     'อื่นๆ',
};

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly auth = inject(AuthService);

  private readonly _requests = signal<LeaveRequest[]>([...MOCK_LEAVE_REQUESTS]);

  readonly allRequests = this._requests.asReadonly();

  /** คำขอลาของ user ปัจจุบัน เรียงตามวันที่ล่าสุดก่อน */
  readonly myLeaveHistory = computed<LeaveRequest[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this._requests()
      .filter(r => r.employee.id === user.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  /** สิทธิ์การลาของ user ปัจจุบัน */
  readonly myLeaveBalance = computed<LeaveBalance[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return MOCK_LEAVE_BALANCES_MAP[user.employeeId] ?? [];
  });

  /** จำนวน request ที่ยัง pending */
  readonly pendingCount = computed(() =>
    this._requests().filter(r => r.status === 'pending').length
  );

  /** จำนวน request ที่อนุมัติแล้วในเดือนปัจจุบัน (นับจาก reviewedAt) */
  readonly approvedThisMonth = computed(() => {
    const now = new Date();
    return this._requests().filter(r =>
      r.status === 'approved' &&
      r.reviewedAt &&
      r.reviewedAt.getFullYear() === now.getFullYear() &&
      r.reviewedAt.getMonth() === now.getMonth()
    ).length;
  });

  submitLeaveRequest(data: {
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    reason: string;
  }): LeaveRequest {
    const user = this.auth.currentUser()!;
    const newRequest: LeaveRequest = {
      id: `lr${Date.now()}`,
      employee: user,
      leaveType: data.leaveType,
      leaveTypeLabel: LEAVE_TYPE_LABELS[data.leaveType],
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: data.totalDays,
      reason: data.reason,
      status: 'pending',
      createdAt: new Date(),
    };
    this._requests.update(list => [...list, newRequest]);
    return newRequest;
  }

  approveRequest(id: string): void {
    const req = this._requests().find(r => r.id === id);
    if (!req || req.status !== 'pending') return;
    const reviewer = this.auth.currentUser()!;
    this._requests.update(list =>
      list.map(r =>
        r.id === id
          ? { ...r, status: 'approved' as LeaveStatus, reviewedBy: reviewer, reviewedAt: new Date() }
          : r
      )
    );
  }

  rejectRequest(id: string, rejectReason?: string): void {
    const req = this._requests().find(r => r.id === id);
    if (!req || req.status !== 'pending') return;
    const reviewer = this.auth.currentUser()!;
    this._requests.update(list =>
      list.map(r =>
        r.id === id
          ? { ...r, status: 'rejected' as LeaveStatus, reviewedBy: reviewer, reviewedAt: new Date(), rejectReason }
          : r
      )
    );
  }
}
