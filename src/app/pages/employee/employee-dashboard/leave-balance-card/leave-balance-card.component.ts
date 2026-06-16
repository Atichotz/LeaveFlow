import { Component, computed, input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHospital, faSun, faBriefcase, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { LeaveBalance, LeaveType } from '../../../../core/models';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';

interface LeaveTypeConfig {
  icon: IconDefinition;
  iconColorClass: string;
  iconBgClass: string;
}

const LEAVE_TYPE_CONFIG: Partial<Record<LeaveType, LeaveTypeConfig>> = {
  sick:      { icon: faHospital,       iconColorClass: 'text-rose-500',   iconBgClass: 'bg-rose-50' },
  annual:    { icon: faSun,            iconColorClass: 'text-sky-500',    iconBgClass: 'bg-sky-50' },
  personal:  { icon: faBriefcase,      iconColorClass: 'text-violet-500', iconBgClass: 'bg-violet-50' },
  maternity: { icon: faCircleQuestion, iconColorClass: 'text-pink-500',   iconBgClass: 'bg-pink-50' },
};

const DEFAULT_CONFIG: LeaveTypeConfig = {
  icon: faCircleQuestion,
  iconColorClass: 'text-gray-500',
  iconBgClass: 'bg-gray-50',
};

@Component({
  selector: 'app-leave-balance-card',
  imports: [StatCardComponent],
  templateUrl: './leave-balance-card.component.html',
  styleUrl: './leave-balance-card.component.scss'
})
export class LeaveBalanceCardComponent {
  readonly balance = input.required<LeaveBalance>();

  readonly config = computed<LeaveTypeConfig>(() =>
    LEAVE_TYPE_CONFIG[this.balance().leaveType] ?? DEFAULT_CONFIG
  );

  readonly subtext = computed(() => {
    const b = this.balance();
    return `ใช้ไป ${b.used} / รวม ${b.total} วัน`;
  });
}
