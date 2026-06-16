import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { LeaveService } from '../../../core/services/leave.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ApprovalCardComponent } from './approval-card/approval-card.component';
import { RejectDialogComponent } from './reject-dialog/reject-dialog.component';

@Component({
  selector: 'app-admin-approvals',
  imports: [FontAwesomeModule, ApprovalCardComponent, RejectDialogComponent],
  templateUrl: './admin-approvals.component.html',
  styleUrl: './admin-approvals.component.scss',
})
export class AdminApprovalsComponent {
  private readonly leaveService = inject(LeaveService);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(true);
  readonly emptyIcon = faClipboardCheck;

  constructor() {
    setTimeout(() => this.isLoading.set(false), 800);
  }

  readonly pendingRequests = computed(() =>
    this.leaveService.allRequests().filter(r => r.status === 'pending')
  );

  /** id ของ request ที่กำลังจะ reject (null = dialog ปิด) */
  readonly rejectTargetId = signal<string | null>(null);

  readonly dialogVisible = computed(() => this.rejectTargetId() !== null);

  onApprove(id: string): void {
    this.leaveService.approveRequest(id);
    this.toast.show('อนุมัติคำขอลาเรียบร้อยแล้ว', 'success');
  }

  openRejectDialog(id: string): void {
    this.rejectTargetId.set(id);
  }

  onRejectConfirmed(reason: string): void {
    const id = this.rejectTargetId();
    if (!id) return;
    this.leaveService.rejectRequest(id, reason || undefined);
    this.toast.show('ปฏิเสธคำขอลาเรียบร้อยแล้ว', 'error');
    this.rejectTargetId.set(null);
  }

  onRejectCancelled(): void {
    this.rejectTargetId.set(null);
  }
}
