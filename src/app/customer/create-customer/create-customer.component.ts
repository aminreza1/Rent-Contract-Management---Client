import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiSource } from 'src/app/infrastructure/api-source';
import { CreateCustomerDto } from 'src/app/infrastructure/interfaces/customer.interface';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  createCustomerform: FormGroup;
  isProcessing: boolean = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private snackbar: MySnackbarService
  ) {}

  ngOnInit(): void {
    this.createCustomerform = new FormGroup({
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
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.createCustomerform.controls[controlName].hasError(errorName);
  };

  SaveCustomer() {
    this.isProcessing = true;
    var model: CreateCustomerDto = {
      firstName: this.createCustomerform.value.firstName,
      lastName: this.createCustomerform.value.lastName,
      nationalCode: this.createCustomerform.value.nationalCode,
      mobile: this.createCustomerform.value.mobile,
      phone: this.createCustomerform.value.phone,
      address: this.createCustomerform.value.address,
    };
    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.customerCreate, model)
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
