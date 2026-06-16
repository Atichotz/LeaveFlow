import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { EmployeeService } from '../../../core/services/employee.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { TableSkeletonComponent } from '../../../shared/components/skeleton/table-skeleton.component';

@Component({
  selector: 'app-admin-employees',
  imports: [FormsModule, FontAwesomeModule, AvatarComponent, TableSkeletonComponent],
  templateUrl: './admin-employees.component.html',
  styleUrl: './admin-employees.component.scss',
})
export class AdminEmployeesComponent {
  private readonly employeeService = inject(EmployeeService);

  readonly isLoading = signal(true);
  readonly searchIcon = faMagnifyingGlass;
  readonly searchQuery = signal('');

  constructor() {
    setTimeout(() => this.isLoading.set(false), 800);
  }

  readonly employees = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.employeeService.getEmployees();
    if (!q) return all;
    return all.filter(
      e =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q)
    );
  });
}
