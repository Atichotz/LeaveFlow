import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-stat-card',
  imports: [FontAwesomeModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly icon = input.required<IconDefinition>();
  /** Tailwind text color class, e.g. 'text-primary' */
  readonly iconColorClass = input<string>('text-primary');
  /** Tailwind bg class for icon wrapper, e.g. 'bg-primary-light' */
  readonly iconBgClass = input<string>('bg-primary-light');
  /** Optional subtext, e.g. 'ใช้ไป 3 / รวม 10 วัน' */
  readonly subtext = input<string | undefined>(undefined);
}
