import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reject-dialog',
  imports: [FormsModule],
  templateUrl: './reject-dialog.component.html',
  styleUrl: './reject-dialog.component.scss',
})
export class RejectDialogComponent {
  readonly visible = input.required<boolean>();
  readonly confirmed = output<string>();
  readonly cancelled = output<void>();

  readonly reason = signal('');

  confirm(): void {
    this.confirmed.emit(this.reason().trim());
    this.reason.set('');
  }

  cancel(): void {
    this.reason.set('');
    this.cancelled.emit();
  }
}
