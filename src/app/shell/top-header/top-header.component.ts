import { Component, inject, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBell, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-top-header',
  imports: [FontAwesomeModule, AvatarComponent],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss'
})
export class TopHeaderComponent {
  readonly auth = inject(AuthService);

  readonly menuToggle = output<void>();

  readonly showMobileSearch = signal(false);

  toggleMobileSearch(): void {
    this.showMobileSearch.update(v => !v);
  }

  readonly menuIcon = faBars;
  readonly searchIcon = faMagnifyingGlass;
  readonly closeIcon = faXmark;
  readonly bellIcon = faBell;
}
