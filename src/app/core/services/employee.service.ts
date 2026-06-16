import { Injectable } from '@angular/core';
import { User } from '../models';
import { MOCK_USERS } from '../mock/users.mock';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  getEmployees(): User[] {
    return MOCK_USERS.filter(u => u.role === 'employee');
  }

  getEmployeeCount(): number {
    return MOCK_USERS.filter(u => u.role === 'employee').length;
  }
}
