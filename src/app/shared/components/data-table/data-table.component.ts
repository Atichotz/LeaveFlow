import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { LeaveStatus } from '../../../core/models';

export type ColumnType = 'text' | 'date' | 'status' | 'days';

export interface ColumnDef {
  key: string;
  label: string;
  type?: ColumnType;
}

@Component({
  selector: 'app-data-table',
  imports: [DatePipe, StatusBadgeComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  readonly columns = input.required<ColumnDef[]>();
  readonly data = input.required<Record<string, unknown>[]>();

  /** Supports dot-notation keys, e.g. 'employee.name' */
  getCellValue(row: Record<string, unknown>, key: string): unknown {
    return key.split('.').reduce(
      (obj, k) => (obj as Record<string, unknown>)?.[k],
      row as unknown
    );
  }

  asLeaveStatus(val: unknown): LeaveStatus {
    return val as LeaveStatus;
  }

  asDate(val: unknown): Date {
    return val as Date;
  }

  asNumber(val: unknown): number {
    return val as number;
  }
}
