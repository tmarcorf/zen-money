import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateIncomeComponent } from './create-update-income.component';

describe('CreateUpdateIncomeComponent', () => {
  let component: CreateUpdateIncomeComponent;
  let fixture: ComponentFixture<CreateUpdateIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
