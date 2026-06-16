import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faClipboardList,
  faCalendarCheck,
  faUmbrellaBeach,
} from '@fortawesome/free-solid-svg-icons';
import { LeaveService } from '../../../core/services/leave.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, ColumnDef } from '../../../shared/components/data-table/data-table.component';
import { StatCardSkeletonComponent } from '../../../shared/components/skeleton/stat-card-skeleton.component';
import { TableSkeletonComponent } from '../../../shared/components/skeleton/table-skeleton.component';
import { MOCK_HOLIDAYS_2026 } from '../../../core/mock/holidays.mock';

const RECENT_LIMIT = 5;

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, FontAwesomeModule, StatCardComponent, DataTableComponent, StatCardSkeletonComponent, TableSkeletonComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  readonly isLoading = signal(true);

  constructor() {
    setTimeout(() => this.isLoading.set(false), 800);
  }
  private readonly leaveService = inject(LeaveService);
  private readonly employeeService = inject(EmployeeService);

  readonly icons = {
    users: faUsers,
    pending: faClipboardList,
    approved: faCalendarCheck,
    holiday: faUmbrellaBeach,
  };

  readonly employeeCount = this.employeeService.getEmployeeCount();
  readonly pendingCount = this.leaveService.pendingCount;
  readonly approvedThisMonth = this.leaveService.approvedThisMonth;

  readonly holidaysThisMonth = computed(() => {
    const now = new Date();
    return MOCK_HOLIDAYS_2026.filter(
      h => h.date.getFullYear() === now.getFullYear() && h.date.getMonth() === now.getMonth()
    ).length;
  });

  readonly recentRequests = computed(() =>
    [...this.leaveService.allRequests()]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, RECENT_LIMIT)
  );

  readonly tableData = computed(() =>
    this.recentRequests() as unknown as Record<string, unknown>[]
  );

  readonly tableColumns: ColumnDef[] = [
    { key: 'employee.name',   label: 'พนักงาน',        type: 'text' },
    { key: 'leaveTypeLabel',  label: 'ประเภทการลา',    type: 'text' },
    { key: 'startDate',       label: 'วันที่เริ่ม',     type: 'date' },
    { key: 'totalDays',       label: 'จำนวนวัน',       type: 'days' },
    { key: 'status',          label: 'สถานะ',           type: 'status' },
  ];
}
