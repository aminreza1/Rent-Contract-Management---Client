import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSource } from 'src/app/infrastructure/api-source';
import {
  CustomerDto,
  UpdateCustomerDto,
} from 'src/app/infrastructure/interfaces/customer.interface';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css'],
})
export class UpdateCustomerComponent implements OnInit {
  updateCustomerform: FormGroup;
  customer: CustomerDto;
  customerId: number;
  customerName: string;
  isProcessing: boolean = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MySnackbarService
  ) {
    this.customer = {} as CustomerDto;
  }

  ngOnInit(): void {
    this.updateCustomerform = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null, Validators.required),
      nationalCode: new FormControl(null),
      mobile: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0][9][0-9]{9}$'),
        ])
      ),
      phone: new FormControl(null),
      address: new FormControl(null),
    });

    this.customerId = this.route.snapshot.params['id'];

    if (this.customerId) {
      this.httpService
        .getSecureDefault<CustomerDto>(
          ApiSource._base + ApiSource.customerItem + this.customerId
        )
        .subscribe(
          (resp: CustomerDto) => {
            this.customer = resp;
            this.customerName = resp.firstName + ' ' + resp.lastName;
            this.updateCustomerform = new FormGroup({
              firstName: new FormControl(this.customer.firstName),
              lastName: new FormControl(
                this.customer.lastName,
                Validators.required
              ),
              nationalCode: new FormControl(this.customer.nationalCode),
              mobile: new FormControl(
                this.customer.mobile,
                Validators.compose([
                  Validators.required,
                  Validators.pattern('^[0][9][0-9]{9}$'),
                ])
              ),
              phone: new FormControl(this.customer.phone),
              address: new FormControl(this.customer.address),
            });
          },
          (err: string) => {
            this.snackbar.confirmToast(err);
          }
        );
    }
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.updateCustomerform.controls[controlName].hasError(errorName);
  };

  UpdateCustomer() {
    this.isProcessing = true;
    var model: UpdateCustomerDto = {
      id: this.customer.id,
      firstName: this.updateCustomerform.value.firstName,
      lastName: this.updateCustomerform.value.lastName,
      nationalCode: this.updateCustomerform.value.nationalCode,
      mobile: this.updateCustomerform.value.mobile,
      phone: this.updateCustomerform.value.phone,
      address: this.updateCustomerform.value.address,
    };
    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.customerUpdate, model)
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status == 204 || resp.status == 200) {
            this.snackbar.SuccessfullToast();
            this.router.navigate(['/customers']);
          } else
            this.snackbar.confirmToast(
              'Error ' + resp.status + ': When response is ok'
            );
          this.isProcessing = false;
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
          this.isProcessing = false;
        }
      );
  }
}
