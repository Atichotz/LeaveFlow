import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'ทดสอบ');
    fixture.componentRef.setInput('value', 10);
    fixture.componentRef.setInput('icon', faHouse);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
