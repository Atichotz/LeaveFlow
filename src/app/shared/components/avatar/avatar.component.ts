import { Component, computed, input } from '@angular/core';
import { User } from '../../../core/models';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  readonly user = input.required<User>();
  readonly size = input<'sm' | 'md'>('sm');

  readonly initials = computed(() =>
    this.user().name.split(' ').map(n => n[0]).slice(0, 2).join('')
  );

  readonly sizeClasses = computed(() =>
    this.size() === 'md' ? 'h-10 w-10 text-sm' : 'h-9 w-9 text-xs'
  );
}
