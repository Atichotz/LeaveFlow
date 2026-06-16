import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatusBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', 'pending');
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should show pending label', () => expect(component.label()).toBe('รอดำเนินการ'));
  it('should apply pending badge class', () => expect(component.badgeClass()).toBe('badge-pending'));
});
