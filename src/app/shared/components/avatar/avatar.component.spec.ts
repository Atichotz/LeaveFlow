import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { User } from '../../../core/models';

const MOCK_USER: User = {
  id: 'u1', employeeId: 'EMP001', name: 'Test User', email: 'test@test.com',
  position: 'Dev', department: 'IT', role: 'employee',
};

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AvatarComponent] }).compileComponents();
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', MOCK_USER);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should show initials when no avatarUrl', () => {
    expect(component.initials()).toBe('TU');
  });
});
