import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faTag,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { LeaveRequest } from '../../../../core/models';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-approval-card',
  imports: [DatePipe, FontAwesomeModule, AvatarComponent],
  templateUrl: './approval-card.component.html',
  styleUrl: './approval-card.component.scss',
})
export class ApprovalCardComponent {
  readonly request = input.required<LeaveRequest>();
  readonly approve = output<void>();
  readonly reject = output<void>();

  readonly icons = {
    calendar: faCalendarDays,
    tag: faTag,
    file: faFileLines,
  };
}
