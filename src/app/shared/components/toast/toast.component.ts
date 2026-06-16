import { Component, computed, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-toast',
  imports: [FontAwesomeModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  readonly toast = this.toastService.current;

  readonly icon = computed<IconDefinition>(() => {
    const type = this.toast()?.type;
    if (type === 'error') return faCircleXmark;
    if (type === 'warning') return faTriangleExclamation;
    return faCircleCheck;
  });

  readonly colorClasses = computed(() => {
    const type = this.toast()?.type;
    if (type === 'error') return 'bg-red-50 border-red-200 text-red-700';
    if (type === 'warning') return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  });
}
