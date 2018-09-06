import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowDashboardComponent } from './escrow-dashboard.component';

describe('EscrowDashboardComponent', () => {
  let component: EscrowDashboardComponent;
  let fixture: ComponentFixture<EscrowDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrowDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrowDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
