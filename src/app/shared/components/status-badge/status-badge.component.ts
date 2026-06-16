import { Component, computed, input } from '@angular/core';
import { LeaveStatus } from '../../../core/models';

const BADGE_CLASS: Record<LeaveStatus, string> = {
  approved: 'badge-approved',
  pending:  'badge-pending',
  rejected: 'badge-rejected',
};

const BADGE_LABEL: Record<LeaveStatus, string> = {
  approved: 'อนุมัติแล้ว',
  pending:  'รอดำเนินการ',
  rejected: 'ปฏิเสธ',
};

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  readonly status = input.required<LeaveStatus>();

  readonly badgeClass = computed(() => BADGE_CLASS[this.status()]);
  readonly label = computed(() => BADGE_LABEL[this.status()]);
}
