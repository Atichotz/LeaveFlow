import { Component, computed, inject, signal } from '@angular/core';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveStatus } from '../../../core/models';
import { DataTableComponent, ColumnDef } from '../../../shared/components/data-table/data-table.component';
import { TableSkeletonComponent } from '../../../shared/components/skeleton/table-skeleton.component';

type FilterStatus = LeaveStatus | 'all';

interface FilterOption {
  value: FilterStatus;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all',      label: 'ทั้งหมด' },
  { value: 'pending',  label: 'รอดำเนินการ' },
  { value: 'approved', label: 'อนุมัติแล้ว' },
  { value: 'rejected', label: 'ปฏิเสธ' },
];

@Component({
  selector: 'app-employee-history',
  imports: [DataTableComponent, TableSkeletonComponent],
  templateUrl: './employee-history.component.html',
  styleUrl: './employee-history.component.scss'
})
export class EmployeeHistoryComponent {
  private readonly leaveService = inject(LeaveService);

  readonly isLoading = signal(true);
  readonly filterOptions = FILTER_OPTIONS;
  readonly activeFilter = signal<FilterStatus>('all');

  constructor() {
    setTimeout(() => this.isLoading.set(false), 800);
  }

  readonly filteredHistory = computed(() => {
    const filter = this.activeFilter();
    const history = this.leaveService.myLeaveHistory();
    return filter === 'all' ? history : history.filter(r => r.status === filter);
  });

  readonly tableData = computed(() =>
    this.filteredHistory() as unknown as Record<string, unknown>[]
  );

  readonly tableColumns: ColumnDef[] = [
    { key: 'leaveTypeLabel', label: 'ประเภทการลา', type: 'text' },
    { key: 'startDate',      label: 'วันที่เริ่ม',   type: 'date' },
    { key: 'endDate',        label: 'วันที่สิ้นสุด', type: 'date' },
    { key: 'totalDays',      label: 'จำนวนวัน',     type: 'days' },
    { key: 'status',         label: 'สถานะ',         type: 'status' },
  ];

  setFilter(status: FilterStatus): void {
    this.activeFilter.set(status);
  }
}
