import { LeaveBalance } from '../models';

/** LeaveBalance ของ EMP002 (สมหญิง) — ใช้ใน employee dashboard mock */
export const MOCK_LEAVE_BALANCES_EMP002: LeaveBalance[] = [
  { leaveType: 'sick',     label: 'ลาป่วย',    total: 30, used: 5,  remaining: 25 },
  { leaveType: 'annual',   label: 'ลาพักร้อน', total: 10, used: 3,  remaining: 7  },
  { leaveType: 'personal', label: 'ลากิจ',     total: 3,  used: 1,  remaining: 2  },
];

export const MOCK_LEAVE_BALANCES_EMP003: LeaveBalance[] = [
  { leaveType: 'sick',     label: 'ลาป่วย',    total: 30, used: 12, remaining: 18 },
  { leaveType: 'annual',   label: 'ลาพักร้อน', total: 10, used: 7,  remaining: 3  },
  { leaveType: 'personal', label: 'ลากิจ',     total: 3,  used: 3,  remaining: 0  },
];

export const MOCK_LEAVE_BALANCES_EMP004: LeaveBalance[] = [
  { leaveType: 'sick',     label: 'ลาป่วย',    total: 30, used: 2,  remaining: 28 },
  { leaveType: 'annual',   label: 'ลาพักร้อน', total: 10, used: 0,  remaining: 10 },
  { leaveType: 'personal', label: 'ลากิจ',     total: 3,  used: 0,  remaining: 3  },
];

export const MOCK_LEAVE_BALANCES_EMP005: LeaveBalance[] = [
  { leaveType: 'sick',     label: 'ลาป่วย',    total: 30, used: 8,  remaining: 22 },
  { leaveType: 'annual',   label: 'ลาพักร้อน', total: 10, used: 10, remaining: 0  },
  { leaveType: 'personal', label: 'ลากิจ',     total: 3,  used: 2,  remaining: 1  },
];

export const MOCK_LEAVE_BALANCES_EMP006: LeaveBalance[] = [
  { leaveType: 'sick',     label: 'ลาป่วย',    total: 30, used: 0,  remaining: 30 },
  { leaveType: 'annual',   label: 'ลาพักร้อน', total: 10, used: 4,  remaining: 6  },
  { leaveType: 'personal', label: 'ลากิจ',     total: 3,  used: 1,  remaining: 2  },
];

/** Map employeeId → LeaveBalance[] สำหรับ lookup เร็ว */
export const MOCK_LEAVE_BALANCES_MAP: Record<string, LeaveBalance[]> = {
  EMP002: MOCK_LEAVE_BALANCES_EMP002,
  EMP003: MOCK_LEAVE_BALANCES_EMP003,
  EMP004: MOCK_LEAVE_BALANCES_EMP004,
  EMP005: MOCK_LEAVE_BALANCES_EMP005,
  EMP006: MOCK_LEAVE_BALANCES_EMP006,
};
