import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesByCategoryDashboardComponent } from './expenses-by-category-dashboard.component';

describe('ExpensesByCategoryDashboardComponent', () => {
  let component: ExpensesByCategoryDashboardComponent;
  let fixture: ComponentFixture<ExpensesByCategoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesByCategoryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesByCategoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
