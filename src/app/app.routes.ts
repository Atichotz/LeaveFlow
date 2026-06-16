import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ShellComponent } from './shell/shell.component';
import { EmployeeDashboardComponent } from './pages/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeRequestComponent } from './pages/employee/employee-request/employee-request.component';
import { EmployeeHistoryComponent } from './pages/employee/employee-history/employee-history.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminEmployeesComponent } from './pages/admin/admin-employees/admin-employees.component';
import { AdminApprovalsComponent } from './pages/admin/admin-approvals/admin-approvals.component';
import { AdminCalendarComponent } from './pages/admin/admin-calendar/admin-calendar.component';
import { AdminReportsComponent } from './pages/admin/admin-reports/admin-reports.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
// import { authGuard } from './core/guards/auth.guard';
// import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', title: 'เข้าสู่ระบบ | LeaveFlow', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: 'employee',
        children: [
          { path: 'dashboard', title: 'Dashboard | LeaveFlow',        component: EmployeeDashboardComponent },
          { path: 'request',   title: 'ยื่นคำขอลา | LeaveFlow',       component: EmployeeRequestComponent },
          { path: 'history',   title: 'ประวัติการลา | LeaveFlow',      component: EmployeeHistoryComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
      {
        path: 'admin',
        // canActivate: [adminGuard],
        children: [
          { path: 'dashboard',  title: 'Admin Dashboard | LeaveFlow',  component: AdminDashboardComponent },
          { path: 'employees',  title: 'จัดการพนักงาน | LeaveFlow',    component: AdminEmployeesComponent },
          { path: 'approvals',  title: 'คำขอลา | LeaveFlow',           component: AdminApprovalsComponent },
          { path: 'calendar',   title: 'ปฏิทิน | LeaveFlow',           component: AdminCalendarComponent },
          { path: 'reports',    title: 'รายงาน | LeaveFlow',           component: AdminReportsComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'employee/dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', title: 'ไม่พบหน้า | LeaveFlow', component: NotFoundComponent },
];
