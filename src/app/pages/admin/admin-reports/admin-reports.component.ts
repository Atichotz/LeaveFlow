import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LeaveService } from '../../../core/services/leave.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { LeaveStatus, LeaveType } from '../../../core/models';
import { TableSkeletonComponent } from '../../../shared/components/skeleton/table-skeleton.component';

const MONTH_NAMES_TH = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

interface MonthSummaryRow {
  label: string;
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

interface EmployeeSummaryRow {
  name: string;
  employeeId: string;
  department: string;
  sick: number;
  annual: number;
  personal: number;
  other: number;
  total: number;
}

function escapeCSVField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

@Component({
  selector: 'app-admin-reports',
  imports: [FontAwesomeModule, TableSkeletonComponent, NgxChartsModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss',
})
export class AdminReportsComponent {
  private readonly leaveService = inject(LeaveService);
  private readonly employeeService = inject(EmployeeService);

  readonly isLoading = signal(true);
  readonly downloadIcon = faDownload;

  readonly statusColorScheme: Color = {
    name: 'statusScheme', selectable: true, group: ScaleType.Ordinal,
    domain: ['#10B981', '#F59E0B', '#EF4444'],
  };
  readonly typeColorScheme: Color = {
    name: 'typeScheme', selectable: true, group: ScaleType.Ordinal,
    domain: ['#EF4444', '#3B82F6', '#8B5CF6'],
  };
  readonly legendBelow = LegendPosition.Below;

  constructor() {
    setTimeout(() => this.isLoading.set(false), 800);
  }

  /** Monthly summary: group by year-month of createdAt */
  readonly monthlySummary = computed<MonthSummaryRow[]>(() => {
    const map = new Map<string, { approved: number; pending: number; rejected: number }>();

    for (const req of this.leaveService.allRequests()) {
      const d = req.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      const entry = map.get(key) ?? { approved: 0, pending: 0, rejected: 0 };
      entry[req.status as LeaveStatus]++;
      map.set(key, entry);
    }

    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, counts]) => {
        const [year, monthIdx] = key.split('-').map(Number);
        return {
          label: `${MONTH_NAMES_TH[monthIdx]} ${year}`,
          ...counts,
          total: counts.approved + counts.pending + counts.rejected,
        };
      });
  });

  /** Chart 1: approved/pending/rejected counts grouped by month */
  readonly statusChartData = computed(() =>
    this.monthlySummary().map(row => ({
      name: row.label,
      series: [
        { name: 'อนุมัติ', value: row.approved },
        { name: 'รอดำเนินการ', value: row.pending },
        { name: 'ปฏิเสธ', value: row.rejected },
      ],
    }))
  );

  /** Chart 2: leave-type counts (all statuses) grouped by month */
  readonly typeChartData = computed(() => {
    const map = new Map<string, { sick: number; annual: number; personal: number }>();

    for (const req of this.leaveService.allRequests()) {
      const d = req.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      const entry = map.get(key) ?? { sick: 0, annual: 0, personal: 0 };
      if (req.leaveType === 'sick') entry.sick++;
      else if (req.leaveType === 'annual') entry.annual++;
      else if (req.leaveType === 'personal') entry.personal++;
      map.set(key, entry);
    }

    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, counts]) => {
        const [year, monthIdx] = key.split('-').map(Number);
        return {
          name: `${MONTH_NAMES_TH[monthIdx]} ${year}`,
          series: [
            { name: 'ลาป่วย', value: counts.sick },
            { name: 'ลาพักร้อน', value: counts.annual },
            { name: 'ลากิจ', value: counts.personal },
          ],
        };
      });
  });

  /** Per-employee summary: days taken per leave type */
  readonly employeeSummary = computed<EmployeeSummaryRow[]>(() => {
    const employees = this.employeeService.getEmployees();
    const requests = this.leaveService.allRequests().filter(r => r.status === 'approved');

    return employees.map(emp => {
      const empRequests = requests.filter(r => r.employee.id === emp.id);
      const byType = (type: LeaveType) =>
        empRequests.filter(r => r.leaveType === type).reduce((s, r) => s + r.totalDays, 0);
      const sick = byType('sick');
      const annual = byType('annual');
      const personal = byType('personal');
      const other = byType('maternity') + byType('other');
      return {
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department,
        sick,
        annual,
        personal,
        other,
        total: sick + annual + personal + other,
      };
    });
  });

  exportCSV(): void {
    const BOM = '﻿';
    const headers = ['ชื่อพนักงาน', 'รหัสพนักงาน', 'แผนก', 'ลาป่วย', 'ลาพักร้อน', 'ลากิจ', 'อื่นๆ', 'รวม'];
    const rows = this.employeeSummary().map(r => [
      escapeCSVField(r.name),
      escapeCSVField(r.employeeId),
      escapeCSVField(r.department),
      String(r.sick),
      String(r.annual),
      String(r.personal),
      String(r.other),
      String(r.total),
    ]);

    const csv = BOM + [headers.map(escapeCSVField), ...rows].map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
