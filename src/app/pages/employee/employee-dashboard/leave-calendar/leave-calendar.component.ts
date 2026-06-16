import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { LeaveService } from '../../../../core/services/leave.service';
import { LeaveRequest } from '../../../../core/models';
import { HOLIDAY_DATE_SET, HOLIDAY_MAP } from '../../../../core/mock/holidays.mock';

interface CalendarDay {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

const MONTH_NAMES_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
];

const DAY_NAMES = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

const STATUS_LABEL: Record<string, string> = {
  approved: 'อนุมัติแล้ว',
  pending:  'รอดำเนินการ',
  rejected: 'ไม่อนุมัติ',
};

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** วันที่ระหว่าง start–end (inclusive) */
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
  selector: 'app-leave-calendar',
  imports: [FontAwesomeModule],
  templateUrl: './leave-calendar.component.html',
  styleUrl: './leave-calendar.component.scss',
})
export class LeaveCalendarComponent {
  private readonly leaveService = inject(LeaveService);

  readonly icons = { prev: faChevronLeft, next: faChevronRight };
  readonly dayNames = DAY_NAMES;
  readonly statusLabel = STATUS_LABEL;

  private readonly today = new Date();

  readonly currentYear = signal(this.today.getFullYear());
  readonly currentMonth = signal(this.today.getMonth());

  readonly monthLabel = computed(
    () => `${MONTH_NAMES_TH[this.currentMonth()]} ${this.currentYear()}`
  );

  /** Map dateKey → LeaveRequest[] เฉพาะของ user ปัจจุบัน (approved + pending + rejected) */
  readonly leavesByDate = computed<Map<string, LeaveRequest[]>>(() => {
    const map = new Map<string, LeaveRequest[]>();
    for (const req of this.leaveService.myLeaveHistory()) {
      for (const day of eachDayOfRange(req.startDate, req.endDate)) {
        const key = toDateKey(day);
        const list = map.get(key) ?? [];
        list.push(req);
        map.set(key, list);
      }
    }
    return map;
  });

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const todayKey = toDateKey(this.today);

    const firstOfMonth = new Date(year, month, 1);
    const rawDay = firstOfMonth.getDay();
    const paddingBefore = rawDay === 0 ? 6 : rawDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((paddingBefore + daysInMonth) / 7) * 7;

    const days: CalendarDay[] = [];
    const startDate = new Date(year, month, 1 - paddingBefore);

    for (let i = 0; i < totalCells; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = toDateKey(date);
      days.push({
        date,
        dateKey,
        isCurrentMonth: date.getMonth() === month,
        isToday: dateKey === todayKey,
        isHoliday: HOLIDAY_DATE_SET.has(dateKey),
        holidayName: HOLIDAY_MAP.get(dateKey),
      });
    }
    return days;
  });

  readonly selectedDate = signal<string | null>(null);

  readonly selectedDayLeaves = computed<LeaveRequest[]>(() => {
    const key = this.selectedDate();
    return key ? (this.leavesByDate().get(key) ?? []) : [];
  });

  readonly selectedDayLabel = computed(() => {
    const key = this.selectedDate();
    if (!key) return '';
    const [y, m, d] = key.split('-').map(Number);
    return `${d} ${MONTH_NAMES_TH[m - 1]} ${y}`;
  });

  readonly selectedDateIsHoliday = computed(() => {
    const key = this.selectedDate();
    return key ? HOLIDAY_DATE_SET.has(key) : false;
  });

  readonly selectedDateHolidayName = computed(() => {
    const key = this.selectedDate();
    return key ? (HOLIDAY_MAP.get(key) ?? null) : null;
  });

  prevMonth(): void {
    const m = this.currentMonth();
    if (m === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(v => v - 1);
    }
    this.selectedDate.set(null);
  }

  nextMonth(): void {
    const m = this.currentMonth();
    if (m === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(v => v + 1);
    }
    this.selectedDate.set(null);
  }

  selectDay(key: string): void {
    this.selectedDate.set(this.selectedDate() === key ? null : key);
  }

  getDayLeaves(key: string): LeaveRequest[] {
    return this.leavesByDate().get(key) ?? [];
  }
}
