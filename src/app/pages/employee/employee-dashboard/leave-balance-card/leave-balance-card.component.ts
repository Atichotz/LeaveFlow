import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHospital, faSun, faBriefcase, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { LeaveBalance, LeaveType } from '../../../../core/models';

interface LeaveTypeConfig {
  icon: IconDefinition;
  iconColorClass: string;
  iconBgClass: string;
  progressClass: string;
}

const LEAVE_TYPE_CONFIG: Partial<Record<LeaveType, LeaveTypeConfig>> = {
  sick:      { icon: faHospital,       iconColorClass: 'text-rose-500',   iconBgClass: 'bg-rose-50',   progressClass: 'bg-rose-400' },
  annual:    { icon: faSun,            iconColorClass: 'text-sky-500',    iconBgClass: 'bg-sky-50',    progressClass: 'bg-sky-400' },
  personal:  { icon: faBriefcase,      iconColorClass: 'text-violet-500', iconBgClass: 'bg-violet-50', progressClass: 'bg-violet-400' },
  maternity: { icon: faCircleQuestion, iconColorClass: 'text-pink-500',   iconBgClass: 'bg-pink-50',   progressClass: 'bg-pink-400' },
};

const DEFAULT_CONFIG: LeaveTypeConfig = {
  icon: faCircleQuestion,
  iconColorClass: 'text-gray-500',
  iconBgClass: 'bg-gray-50',
  progressClass: 'bg-gray-400',
};

@Component({
  selector: 'app-leave-balance-card',
  imports: [FontAwesomeModule],
  templateUrl: './leave-balance-card.component.html',
  styleUrl: './leave-balance-card.component.scss'
})
export class LeaveBalanceCardComponent {
  readonly balance = input.required<LeaveBalance>();

  readonly config = computed<LeaveTypeConfig>(() =>
    LEAVE_TYPE_CONFIG[this.balance().leaveType] ?? DEFAULT_CONFIG
  );

  readonly progressPercent = computed(() => {
    const b = this.balance();
    if (b.total === 0) return 0;
    return Math.round((b.used / b.total) * 100);
  });
}
