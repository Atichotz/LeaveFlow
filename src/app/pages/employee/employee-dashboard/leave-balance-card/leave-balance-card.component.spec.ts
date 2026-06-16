import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveBalanceCardComponent } from './leave-balance-card.component';
import { LeaveBalance } from '../../../../core/models';

const MOCK_BALANCE: LeaveBalance = {
  leaveType: 'sick', label: 'ลาป่วย', total: 30, used: 5, remaining: 25,
};

describe('LeaveBalanceCardComponent', () => {
  let component: LeaveBalanceCardComponent;
  let fixture: ComponentFixture<LeaveBalanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LeaveBalanceCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(LeaveBalanceCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('balance', MOCK_BALANCE);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should show subtext with used/total', () => {
    expect(component.subtext()).toBe('ใช้ไป 5 / รวม 30 วัน');
  });
});
