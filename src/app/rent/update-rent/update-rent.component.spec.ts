import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRentContractComponent } from './update-rent-contract.component';

describe('UpdateRentContractComponent', () => {
  let component: UpdateRentContractComponent;
  let fixture: ComponentFixture<UpdateRentContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRentContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRentContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
