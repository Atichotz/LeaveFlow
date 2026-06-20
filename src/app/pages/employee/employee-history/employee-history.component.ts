import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarDays, faCircleCheck, faClock, faCircleXmark,
  faChevronLeft, faChevronRight, faMagnifyingGlass, faRotateLeft,
  faCalendar, faBriefcase, faUmbrellaBeach, faPlus, faHospital, faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../../core/models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { TableSkeletonComponent } from '../../../shared/components/skeleton/table-skeleton.component';
import { RouterLink } from '@angular/router';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  leaveStatus?: LeaveStatus;
}

@Component({
  selector: 'app-employee-history',
  imports: [FontAwesomeModule, FormsModule, StatusBadgeComponent, AvatarComponent, TableSkeletonComponent, RouterLink],
  templateUrl: './employee-history.component.html',
  styleUrl: './employee-history.component.scss'
})
export class EmployeeHistoryComponent {
  private readonly leaveService = inject(LeaveService);

  readonly Math = Math;

  // Icons
  readonly faCalendarDays = faCalendarDays;
  readonly faCircleCheck  = faCircleCheck;
  readonly faClock        = faClock;
  readonly faCircleXmark  = faCircleXmark;
  readonly faChevronLeft  = faChevronLeft;
  readonly faChevronRight = faChevronRight;
  readonly faSearch       = faMagnifyingGlass;
  readonly faRotateLeft   = faRotateLeft;
  readonly faPlus         = faPlus;

  readonly leaveTypeIconMap: Record<LeaveType, { icon: IconDefinition; bgClass: string; iconClass: string }> = {
    annual:    { icon: faUmbrellaBeach, bgClass: 'bg-green-100',  iconClass: 'text-green-600'  },
    sick:      { icon: faHospital,      bgClass: 'bg-red-100',    iconClass: 'text-red-600'    },
    personal:  { icon: faBriefcase,     bgClass: 'bg-amber-100',  iconClass: 'text-amber-600'  },
    maternity: { icon: faHeart,         bgClass: 'bg-pink-100',   iconClass: 'text-pink-600'   },
    other:     { icon: faCalendar,      bgClass: 'bg-gray-100',   iconClass: 'text-gray-600'   },
  };

  readonly DOW_LABELS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] as const;

  readonly currentThaiYear = new Date().getFullYear() + 543;

  readonly isLoading = signal(true);

  // Filters
  readonly filterType   = signal<LeaveType | ''>('');
  readonly filterStatus = signal<LeaveStatus | ''>('');
  readonly searchText   = signal('');

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize    = signal(10);

  // Calendar
  readonly calendarDate = signal(new Date());

  constructor() {
    setTimeout(() => this.isLoading.set(false), 800);
  }

  // ── Summary stats ───────────────────────────────────────────────────────────

  readonly summaryStats = computed(() => {
    const history  = this.leaveService.myLeaveHistory();
    const approved = history.filter(r => r.status === 'approved');
    const pending  = history.filter(r => r.status === 'pending');
    const rejected = history.filter(r => r.status === 'rejected');
    return {
      totalDays:     history.reduce((s, r) => s + r.totalDays, 0),
      approvedDays:  approved.reduce((s, r) => s + r.totalDays, 0),
      approvedCount: approved.length,
      pendingDays:   pending.reduce((s, r) => s + r.totalDays, 0),
      pendingCount:  pending.length,
      rejectedDays:  rejected.reduce((s, r) => s + r.totalDays, 0),
      rejectedCount: rejected.length,
    };
  });

  readonly leaveBalanceSummary = computed(() => {
    const balances  = this.leaveService.myLeaveBalance();
    const total     = balances.reduce((s, b) => s + b.total, 0);
    const used      = balances.reduce((s, b) => s + b.used, 0);
    const remaining = total - used;
    const usedPct   = total > 0 ? Math.round((used / total) * 100) : 0;
    return { total, used, remaining, usedPct };
  });

  // ── Filtered & paginated ────────────────────────────────────────────────────

  readonly filteredHistory = computed((): LeaveRequest[] => {
    const history = this.leaveService.myLeaveHistory();
    const type    = this.filterType();
    const status  = this.filterStatus();
    const search  = this.searchText().toLowerCase().trim();

    return history.filter(r => {
      if (type   && r.leaveType !== type)   return false;
      if (status && r.status    !== status) return false;
      if (search) {
        const matchReason   = r.reason.toLowerCase().includes(search);
        const matchReviewer = r.reviewedBy?.name.toLowerCase().includes(search) ?? false;
        if (!matchReason && !matchReviewer) return false;
      }
      return true;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredHistory().length / this.pageSize()))
  );

  readonly paginatedHistory = computed((): LeaveRequest[] => {
    const page = this.currentPage();
    const size  = this.pageSize();
    const data  = this.filteredHistory();
    return data.slice((page - 1) * size, page * size);
  });

  readonly pageNumbers = computed((): number[] => {
    const total   = this.totalPages();
    const current = this.currentPage();
    const range: number[] = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      range.push(i);
    }
    return range;
  });

  // ── Calendar ────────────────────────────────────────────────────────────────

  readonly calendarMonthLabel = computed(() =>
    this.calendarDate().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
  );

  readonly calendarWeeks = computed((): CalendarDay[][] => {
    const d     = this.calendarDate();
    const year  = d.getFullYear();
    const month = d.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);

    const leaveDateMap = new Map<string, LeaveStatus>();
    this.leaveService.myLeaveHistory().forEach(r => {
      const cur = new Date(r.startDate);
      const end = new Date(r.endDate);
      while (cur <= end) {
        leaveDateMap.set(cur.toDateString(), r.status);
        cur.setDate(cur.getDate() + 1);
      }
    });

    const days: CalendarDay[] = [];

    const startDow = firstDay.getDay();
    for (let i = startDow - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false, isToday: false });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        leaveStatus: leaveDateMap.get(date.toDateString()),
      });
    }

    for (let day = 1; days.length < 42; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false, isToday: false });
    }

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  // ── Donut chart ─────────────────────────────────────────────────────────────

  readonly donutChart = computed(() => {
    const { used, total } = this.leaveBalanceSummary();
    const circumference = 2 * Math.PI * 40;
    const usedDash      = total > 0 ? (used / total) * circumference : 0;
    return { circumference, offset: circumference - usedDash };
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────

  formatDate(date: Date): string {
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.toDateString() === b.toDateString();
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  prevMonth(): void {
    const d = this.calendarDate();
    this.calendarDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.calendarDate();
    this.calendarDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  clearFilters(): void {
    this.filterType.set('');
    this.filterStatus.set('');
    this.searchText.set('');
    this.currentPage.set(1);
  }

  resetPage(): void {
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  readonly leaveTypeOptions: { value: LeaveType | ''; label: string }[] = [
    { value: '',          label: 'ทั้งหมด'    },
    { value: 'annual',    label: 'ลาพักร้อน'  },
    { value: 'sick',      label: 'ลาป่วย'     },
    { value: 'personal',  label: 'ลากิจ'      },
    { value: 'maternity', label: 'ลาคลอด'     },
    { value: 'other',     label: 'อื่นๆ'       },
  ];

  readonly statusOptions: { value: LeaveStatus | ''; label: string }[] = [
    { value: '',         label: 'ทั้งหมด'     },
    { value: 'approved', label: 'อนุมัติแล้ว' },
    { value: 'pending',  label: 'รออนุมัติ'   },
    { value: 'rejected', label: 'ไม่อนุมัติ'  },
  ];
}
