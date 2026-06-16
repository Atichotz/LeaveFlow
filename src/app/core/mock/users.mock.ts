import { User } from '../models';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    employeeId: 'xRusez',
    name: 'สมชาย ใจดี',
    email: 'somchai@leaveflow.co',
    position: 'ผู้จัดการฝ่าย HR',
    department: 'HR',
    role: 'admin',
    isActive: true,
  },
  {
    id: 'u2',
    employeeId: 'EMP002',
    name: 'สมหญิง รักงาน',
    email: 'somying@leaveflow.co',
    position: 'นักพัฒนาซอฟต์แวร์',
    department: 'IT',
    role: 'employee',
    isActive: true,
  },
  {
    id: 'u3',
    employeeId: 'EMP003',
    name: 'ประชา มั่นคง',
    email: 'pracha@leaveflow.co',
    position: 'นักการตลาด',
    department: 'Marketing',
    role: 'employee',
    isActive: true,
  },
  {
    id: 'u4',
    employeeId: 'EMP004',
    name: 'วิไล สุขใจ',
    email: 'wilai@leaveflow.co',
    position: 'นักบัญชี',
    department: 'Finance',
    role: 'employee',
    isActive: true,
  },
  {
    id: 'u5',
    employeeId: 'EMP005',
    name: 'ธนพล แกร่งกล้า',
    email: 'thanaphon@leaveflow.co',
    position: 'วิศวกรระบบ',
    department: 'IT',
    role: 'employee',
    isActive: true,
  },
  {
    id: 'u6',
    employeeId: 'EMP006',
    name: 'นภา ฟ้าใส',
    email: 'napa@leaveflow.co',
    position: 'นักออกแบบ UX/UI',
    department: 'IT',
    role: 'employee',
    isActive: false,
  },
];

/** ผู้ใช้ที่ login ด้วย role employee สำหรับ test */
export const MOCK_CURRENT_EMPLOYEE: User = MOCK_USERS[1];
/** ผู้ใช้ที่ login ด้วย role admin สำหรับ test */
export const MOCK_CURRENT_ADMIN: User = MOCK_USERS[0];
