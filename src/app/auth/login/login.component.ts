import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly spinnerIcon = faSpinner;
  readonly eyeIcon = faEye;
  readonly eyeSlashIcon = faEyeSlash;

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      const user = this.auth.currentUser()!;
      this.router.navigate([user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard']);
    }
  }

  readonly form = this.fb.nonNullable.group({
    employeeId: ['', [Validators.required, Validators.minLength(3)]],
    password:   ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  get employeeIdCtrl() { return this.form.controls.employeeId; }
  get passwordCtrl()   { return this.form.controls.password; }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isLoading()) return;

    this.errorMessage.set(null);
    this.isLoading.set(true);

    // Simulate async delay (real API call later)
    await new Promise(resolve => setTimeout(resolve, 600));

    const { employeeId, password } = this.form.getRawValue();
    const success = this.auth.login(employeeId, password);

    if (!success) {
      this.errorMessage.set('รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง');
      this.isLoading.set(false);
      return;
    }

    const user = this.auth.currentUser()!;
    this.router.navigate([user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard']);
  }
}
