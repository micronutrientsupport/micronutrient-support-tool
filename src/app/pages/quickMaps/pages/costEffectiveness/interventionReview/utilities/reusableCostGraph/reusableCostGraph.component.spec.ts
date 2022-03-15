import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringCostGraphComponent } from './recurringCostGraph.component';

describe('RecurringCostsGraphComponent', () => {
  let component: RecurringCostGraphComponent;
  let fixture: ComponentFixture<RecurringCostGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurringCostGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringCostGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
