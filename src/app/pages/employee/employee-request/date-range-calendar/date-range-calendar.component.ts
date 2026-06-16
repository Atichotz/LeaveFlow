import { Component, computed, output, signal } from '@angular/core';

const WEEKDAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

/** 'YYYY-MM-DD' from a local Date (avoids UTC-midnight timezone shift) */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface CalDay {
  dateStr: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface CalDayView extends CalDay {
  isStart: boolean;
  isEnd: boolean;
  showStrip: boolean;
  stripFirst: boolean; // strip starts here → only right half shown
  stripLast: boolean;  // strip ends here  → only left half shown
  circleClass: string;
}

const CIRCLE_BASE =
  'relative z-10 mx-auto flex h-8 w-8 select-none items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer ';

@Component({
  selector: 'app-date-range-calendar',
  standalone: true,
  imports: [],
  templateUrl: './date-range-calendar.component.html',
})
export class DateRangeCalendarComponent {
  readonly startChange = output<string>();
  readonly endChange = output<string>();

  private readonly _year = signal(new Date().getFullYear());
  private readonly _month = signal(new Date().getMonth());

  readonly startDate = signal('');
  readonly endDate = signal('');
  private readonly _pickingEnd = signal(false);
  readonly hovered = signal('');

  readonly weekdays = WEEKDAYS;

  readonly monthLabel = computed(
    () => `${MONTHS[this._month()]} ${this._year()}`
  );

  readonly selectionHint = computed(() => {
    if (!this.startDate()) return 'เลือกวันเริ่มต้น';
    if (this._pickingEnd()) return 'เลือกวันสิ้นสุด';
    return null;
  });

  private readonly _calDays = computed((): CalDay[] => {
    const year = this._year(), month = this._month();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7; // shift so Mon = 0
    const start = new Date(first);
    start.setDate(start.getDate() - offset);

    const today = toDateStr(new Date());
    const days: CalDay[] = [];
    const cur = new Date(start);
    for (let i = 0; i < 42; i++) {
      days.push({
        dateStr: toDateStr(cur),
        day: cur.getDate(),
        inMonth: cur.getMonth() === month,
        isToday: toDateStr(cur) === today,
        isWeekend: cur.getDay() === 0 || cur.getDay() === 6,
      });
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  });

  readonly viewDays = computed((): CalDayView[] => {
    const s = this.startDate();
    const e = this.endDate();
    const h = this._pickingEnd() ? this.hovered() : '';
    const eff = e || (h && h >= s ? h : '');   // effective end (real or hover)
    const hasRange = !!s && !!eff && s !== eff;

    return this._calDays().map(day => {
      const d = day.dateStr;
      const isStart   = d === s;
      const isEnd     = d === e;
      const isHoverEnd = !e && !!h && d === h && h > s;
      const inRange   = hasRange && d > s && d < eff;
      const showStrip = hasRange && (isStart || isEnd || isHoverEnd || inRange);

      let cls = CIRCLE_BASE;
      if (isStart || isEnd) {
        cls += 'bg-primary text-white';
      } else if (isHoverEnd) {
        cls += 'bg-primary/80 text-white';
      } else if (inRange) {
        cls += 'text-primary hover:bg-primary/20';
      } else if (!day.inMonth) {
        cls += 'text-gray-300';
      } else if (day.isToday) {
        cls += 'text-primary font-semibold ring-1 ring-primary hover:bg-primary-light';
      } else if (day.isWeekend) {
        cls += 'text-gray-400 hover:bg-gray-100';
      } else {
        cls += 'text-gray-700 hover:bg-gray-100';
      }

      return {
        ...day,
        isStart,
        isEnd,
        showStrip,
        stripFirst: isStart,
        stripLast: isEnd || isHoverEnd,
        circleClass: cls,
      };
    });
  });

  prevMonth() {
    if (this._month() === 0) { this._year.update(y => y - 1); this._month.set(11); }
    else this._month.update(m => m - 1);
  }

  nextMonth() {
    if (this._month() === 11) { this._year.update(y => y + 1); this._month.set(0); }
    else this._month.update(m => m + 1);
  }

  onDayClick(dateStr: string) {
    if (!this._pickingEnd()) {
      this.startDate.set(dateStr);
      this.endDate.set('');
      this._pickingEnd.set(true);
      this.startChange.emit(dateStr);
      this.endChange.emit('');
    } else {
      if (dateStr >= this.startDate()) {
        this.endDate.set(dateStr);
        this._pickingEnd.set(false);
        this.hovered.set('');
        this.endChange.emit(dateStr);
      } else {
        // clicked before start → restart selection
        this.startDate.set(dateStr);
        this.endDate.set('');
        this.startChange.emit(dateStr);
        this.endChange.emit('');
      }
    }
  }

  onHover(dateStr: string) {
    if (this._pickingEnd()) this.hovered.set(dateStr);
  }

  onLeave() {
    this.hovered.set('');
  }
}
