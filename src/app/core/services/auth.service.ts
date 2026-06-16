import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';
import { MOCK_USERS } from '../mock/users.mock';

const STORAGE_KEY = 'leaveflow_user';
const MOCK_PASSWORD = 'password';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(AuthService.loadFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  /** returns true on success, false on bad credentials */
  login(employeeId: string, password: string): boolean {
    if (password !== MOCK_PASSWORD) return false;
    const user = MOCK_USERS.find(u => u.employeeId === employeeId.trim());
    if (!user) return false;
    this._currentUser.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  private static loadFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as User;
      }

      // Demo fallback: ถ้าไม่มี user ใน localStorage ให้ใช้ mock employee คนแรก
      return MOCK_USERS.find(u => u.role === 'employee') ?? MOCK_USERS[0] ?? null;
    } catch {
      return MOCK_USERS.find(u => u.role === 'employee') ?? MOCK_USERS[0] ?? null;
    }
  }
}
