import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerTransactionComponent } from './buyer-transaction.component';

describe('BuyerTransactionComponent', () => {
  let component: BuyerTransactionComponent;
  let fixture: ComponentFixture<BuyerTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
