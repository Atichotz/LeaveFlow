import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { LeaveService } from '../../../core/services/leave.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LeaveType } from '../../../core/models';
import { DateRangeCalendarComponent } from './date-range-calendar/date-range-calendar.component';

interface LeaveTypeOption {
  value: LeaveType;
  label: string;
}

const LEAVE_TYPE_OPTIONS: LeaveTypeOption[] = [
  { value: 'sick',     label: 'ลาป่วย' },
  { value: 'annual',   label: 'ลาพักร้อน' },
  { value: 'personal', label: 'ลากิจ' },
];

function endDateValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if (!start || !end) return null;
  return new Date(end) < new Date(start) ? { endBeforeStart: true } : null;
}

/** Count working days (Mon–Fri) inclusive between two dates */
function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endNorm = new Date(end);
  endNorm.setHours(0, 0, 0, 0);
  while (cur <= endNorm) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

@Component({
  selector: 'app-employee-request',
  imports: [ReactiveFormsModule, RouterLink, DateRangeCalendarComponent],
  templateUrl: './employee-request.component.html',
  styleUrl: './employee-request.component.scss'
})
export class EmployeeRequestComponent {
  private readonly leaveService = inject(LeaveService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly leaveTypeOptions = LEAVE_TYPE_OPTIONS;
  readonly todayStr = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group(
    {
      leaveType: ['sick' as LeaveType, Validators.required],
      startDate: ['', Validators.required],
      endDate:   ['', Validators.required],
      reason:    ['', [Validators.required, Validators.minLength(10)]],
    },
    { validators: endDateValidator }
  );

  readonly isLoading = signal(false);

  // Bridge ReactiveForm → Signal so computed() can track form value changes
  private readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  readonly workingDays = computed(() => {
    const { startDate, endDate } = this.formValue();
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    return e < s ? 0 : countWorkingDays(s, e);
  });

  /** true when start date is in the past */
  readonly isPastDate = computed(() => {
    const start = this.formValue().startDate;
    if (!start) return false;
    const s = new Date(start);
    s.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return s < today;
  });

  /** Remaining days for selected leave type */
  readonly remainingForType = computed(() => {
    const type = this.formValue().leaveType as LeaveType;
    return this.leaveService.myLeaveBalance().find(b => b.leaveType === type)?.remaining ?? 0;
  });

  /** true when working days exceed balance */
  readonly exceedsBalance = computed(() =>
    this.workingDays() > 0 && this.workingDays() > this.remainingForType()
  );

  get ctrl() { return this.form.controls; }

  /** Format 'YYYY-MM-DD' → '15 มิ.ย.' using local date (no UTC shift) */
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  }

  onStartDate(dateStr: string) {
    this.ctrl.startDate.setValue(dateStr);
    this.ctrl.startDate.markAsTouched();
  }

  onEndDate(dateStr: string) {
    this.ctrl.endDate.setValue(dateStr);
    this.ctrl.endDate.markAsTouched();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.exceedsBalance() || this.isLoading()) return;

    this.isLoading.set(true);
    await new Promise(r => setTimeout(r, 500));

    const { leaveType, startDate, endDate, reason } = this.form.getRawValue();
    this.leaveService.submitLeaveRequest({
      leaveType: leaveType as LeaveType,
      startDate: new Date(startDate),
      endDate:   new Date(endDate),
      totalDays: this.workingDays(),
      reason,
    });

    this.toastService.show('ยื่นคำขอลาเรียบร้อยแล้ว รอการอนุมัติ');
    this.router.navigate(['/employee/history']);
  }
}
