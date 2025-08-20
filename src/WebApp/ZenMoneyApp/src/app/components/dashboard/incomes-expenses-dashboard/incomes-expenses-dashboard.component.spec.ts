import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesExpensesDashboardComponent } from './incomes-expenses-dashboard.component';

describe('IncomesExpensesDashboardComponent', () => {
  let component: IncomesExpensesDashboardComponent;
  let fixture: ComponentFixture<IncomesExpensesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomesExpensesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomesExpensesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
