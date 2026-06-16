import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopHeaderComponent } from './top-header/top-header.component';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent, TopHeaderComponent, ToastComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  readonly sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
