import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailComponent } from './sale-detail.component';

describe('SaleDetailComponent', () => {
  let component: SaleDetailComponent;
  let fixture: ComponentFixture<SaleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
