import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LeaveService } from '../../../core/services/leave.service';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveBalanceCardComponent } from './leave-balance-card/leave-balance-card.component';
import { LeaveCalendarComponent } from './leave-calendar/leave-calendar.component';
import { DataTableComponent, ColumnDef } from '../../../shared/components/data-table/data-table.component';
import { StatCardSkeletonComponent } from '../../../shared/components/skeleton/stat-card-skeleton.component';
import { TableSkeletonComponent } from '../../../shared/components/skeleton/table-skeleton.component';

const RECENT_LIMIT = 5;

@Component({
  selector: 'app-employee-dashboard',
  imports: [RouterLink, LeaveBalanceCardComponent, LeaveCalendarComponent, DataTableComponent, StatCardSkeletonComponent, TableSkeletonComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent {
  readonly isLoading = signal(true);

  constructor() {
    setTimeout(() => this.isLoading.set(false), 800);
  }
  readonly auth = inject(AuthService);
  private readonly leaveService = inject(LeaveService);

  readonly balances = this.leaveService.myLeaveBalance;

  readonly recentHistory = computed(() =>
    this.leaveService.myLeaveHistory().slice(0, RECENT_LIMIT)
  );

  readonly tableColumns: ColumnDef[] = [
    { key: 'leaveTypeLabel', label: 'ประเภทการลา', type: 'text' },
    { key: 'startDate',      label: 'วันที่เริ่ม',   type: 'date' },
    { key: 'endDate',        label: 'วันที่สิ้นสุด', type: 'date' },
    { key: 'totalDays',      label: 'จำนวนวัน',     type: 'days' },
    { key: 'status',         label: 'สถานะ',         type: 'status' },
  ];

  readonly tableData = computed(() =>
    this.recentHistory() as unknown as Record<string, unknown>[]
  );
}
