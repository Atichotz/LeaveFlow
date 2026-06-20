import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft, faChevronRight,
  faUsers, faClock, faCalendarCheck, faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest, LeaveStatus } from '../../../core/models';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { HOLIDAY_DATE_SET, HOLIDAY_MAP, MOCK_HOLIDAYS_2026 } from '../../../core/mock/holidays.mock';

interface CalendarDay {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

type StatusFilter = LeaveStatus | 'all';

const MONTH_NAMES_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
];

const DAY_NAMES = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function eachDayOfRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cur <= last) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

@Component({
  selector: 'app-admin-calendar',
  imports: [FontAwesomeModule, AvatarComponent, StatusBadgeComponent],
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.scss',
})
export class AdminCalendarComponent {
  private readonly leaveService = inject(LeaveService);

  readonly icons = {
    prev: faChevronLeft, next: faChevronRight,
    users: faUsers, clock: faClock,
    calCheck: faCalendarCheck, calDays: faCalendarDays,
  };
  readonly dayNames = DAY_NAMES;
  readonly MAX_CELL_VISIBLE = 2;

  private readonly today = new Date();
  readonly todayKey = toDateKey(this.today);

  readonly currentYear  = signal(this.today.getFullYear());
  readonly currentMonth = signal(this.today.getMonth());
  readonly statusFilter = signal<StatusFilter>('all');
  readonly selectedDate = signal<string | null>(null);

  readonly monthLabel = computed(
    () => `${MONTH_NAMES_TH[this.currentMonth()]} ${this.currentYear()}`
  );

  readonly isCurrentDisplayedMonth = computed(() => {
    const now = new Date();
    return this.currentYear() === now.getFullYear() && this.currentMonth() === now.getMonth();
  });

  // All non-rejected leaves mapped to dates — used for stats, side panel, upcoming
  private readonly allLeavesByDate = computed<Map<string, LeaveRequest[]>>(() => {
    const map = new Map<string, LeaveRequest[]>();
    for (const req of this.leaveService.allRequests()) {
      if (req.status === 'rejected') continue;
      for (const day of eachDayOfRange(req.startDate, req.endDate)) {
        const key = toDateKey(day);
        const list = map.get(key) ?? [];
        list.push(req);
        map.set(key, list);
      }
    }
    return map;
  });

  // Filtered for calendar display only (respects statusFilter)
  private readonly filteredLeavesByDate = computed<Map<string, LeaveRequest[]>>(() => {
    const filter = this.statusFilter();
    if (filter === 'all') return this.allLeavesByDate();
    const map = new Map<string, LeaveRequest[]>();
    for (const [key, leaves] of this.allLeavesByDate()) {
      const filtered = leaves.filter(r => r.status === filter);
      if (filtered.length > 0) map.set(key, filtered);
    }
    return map;
  });

  // ── Stats ────────────────────────────────────────────────────────────────────

  readonly todayLeaveCount = computed(() =>
    this.allLeavesByDate().get(this.todayKey)?.length ?? 0
  );

  readonly pendingCount      = this.leaveService.pendingCount;
  readonly approvedThisMonth = this.leaveService.approvedThisMonth;

  readonly holidaysThisMonth = computed(() => {
    const y = this.currentYear();
    const m = this.currentMonth();
    return MOCK_HOLIDAYS_2026.filter(h =>
      h.date.getFullYear() === y && h.date.getMonth() === m
    ).length;
  });

  // ── Calendar grid ────────────────────────────────────────────────────────────

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const year  = this.currentYear();
    const month = this.currentMonth();

    const firstOfMonth  = new Date(year, month, 1);
    const rawDay        = firstOfMonth.getDay();
    const paddingBefore = rawDay === 0 ? 6 : rawDay - 1;
    const daysInMonth   = new Date(year, month + 1, 0).getDate();
    const totalCells    = Math.ceil((paddingBefore + daysInMonth) / 7) * 7;

    const days: CalendarDay[] = [];
    const startDate = new Date(year, month, 1 - paddingBefore);

    for (let i = 0; i < totalCells; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = toDateKey(date);
      days.push({
        date, dateKey,
        isCurrentMonth: date.getMonth() === month,
        isToday:        dateKey === this.todayKey,
        isHoliday:      HOLIDAY_DATE_SET.has(dateKey),
        holidayName:    HOLIDAY_MAP.get(dateKey),
      });
    }
    return days;
  });

  // ── Selected day ─────────────────────────────────────────────────────────────

  // Side panel always shows ALL leaves (not filtered) for selected day
  readonly selectedDayLeaves = computed<LeaveRequest[]>(() => {
    const key = this.selectedDate();
    return key ? (this.allLeavesByDate().get(key) ?? []) : [];
  });

  readonly selectedDayLabel = computed(() => {
    const key = this.selectedDate();
    if (!key) return '';
    const [y, m, d] = key.split('-').map(Number);
    return `${d} ${MONTH_NAMES_TH[m - 1]} ${y}`;
  });

  readonly selectedDateHolidayName = computed(() => {
    const key = this.selectedDate();
    return key ? (HOLIDAY_MAP.get(key) ?? null) : null;
  });

  // ── Upcoming leaves (next 7 days from today) ─────────────────────────────────

  readonly upcomingLeaves = computed<{ dateKey: string; label: string; leaves: LeaveRequest[] }[]>(() => {
    const result: { dateKey: string; label: string; leaves: LeaveRequest[] }[] = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date(this.today);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      const key    = toDateKey(d);
      const leaves = this.allLeavesByDate().get(key);
      if (leaves && leaves.length > 0) {
        const [, m, day] = key.split('-').map(Number);
        const label = i === 0 ? 'วันนี้' : `${day} ${MONTH_NAMES_TH[m - 1]}`;
        result.push({ dateKey: key, label, leaves });
      }
    }
    return result;
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  getDayLeaves(key: string): LeaveRequest[] {
    return this.filteredLeavesByDate().get(key) ?? [];
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(v => v - 1);
    }
    this.selectedDate.set(null);
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(v => v + 1);
    }
    this.selectedDate.set(null);
  }

  goToToday(): void {
    this.currentMonth.set(this.today.getMonth());
    this.currentYear.set(this.today.getFullYear());
    this.selectedDate.set(null);
  }

  selectDay(key: string): void {
    this.selectedDate.set(this.selectedDate() === key ? null : key);
  }

  setStatusFilter(f: StatusFilter): void {
    this.statusFilter.set(f);
  }
}
