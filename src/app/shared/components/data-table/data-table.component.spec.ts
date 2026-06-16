import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent, ColumnDef } from './data-table.component';

const COLS: ColumnDef[] = [{ key: 'name', label: 'ชื่อ', type: 'text' }];
const DATA: Record<string, unknown>[] = [{ name: 'ทดสอบ' }];

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DataTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', COLS);
    fixture.componentRef.setInput('data', DATA);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('getCellValue should handle simple key', () => {
    expect(component.getCellValue({ name: 'ทดสอบ' }, 'name')).toBe('ทดสอบ');
  });
  it('getCellValue should handle dot-notation key', () => {
    expect(component.getCellValue({ employee: { name: 'สมชาย' } } as Record<string, unknown>, 'employee.name')).toBe('สมชาย');
  });
});
