import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRentContractComponent } from './add-rent-contract.component';

describe('AddRentContractComponent', () => {
  let component: AddRentContractComponent;
  let fixture: ComponentFixture<AddRentContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRentContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRentContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
