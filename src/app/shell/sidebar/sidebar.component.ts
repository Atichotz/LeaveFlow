import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faHouse,
  faUsers,
  faClipboardList,
  faCalendarDays,
  faChartBar,
  faPlus,
  faClockRotateLeft,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

interface NavItem {
  label: string;
  route: string;
  icon: IconDefinition;
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', route: '/admin/dashboard', icon: faHouse },
  { label: 'พนักงาน', route: '/admin/employees', icon: faUsers },
  { label: 'คำขอลา', route: '/admin/approvals', icon: faClipboardList },
  { label: 'ปฏิทิน', route: '/admin/calendar', icon: faCalendarDays },
  { label: 'รายงาน', route: '/admin/reports', icon: faChartBar },
];

const EMPLOYEE_NAV: NavItem[] = [
  { label: 'Dashboard', route: '/employee/dashboard', icon: faHouse },
  { label: 'ยื่นลา', route: '/employee/request', icon: faPlus },
  { label: 'ประวัติการลา', route: '/employee/history', icon: faClockRotateLeft },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, AvatarComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly auth = inject(AuthService);

  /** true when sidebar is open on mobile */
  readonly isOpen = input<boolean>(false);
  /** emitted when a nav item is clicked on mobile (close the sidebar) */
  readonly closed = output<void>();
  ToggleAdmin = signal(false);
  readonly navItems = computed<NavItem[]>(() =>
    // this.auth.isAdmin() ? ADMIN_NAV : EMPLOYEE_NAV
    this.ToggleAdmin() ? ADMIN_NAV : EMPLOYEE_NAV
  );

  readonly logoutIcon = faRightFromBracket;

  logout(): void {
    this.auth.logout();
  }
}
