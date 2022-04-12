import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiSource } from 'src/app/infrastructure/api-source';
import { CreateProductDto } from 'src/app/infrastructure/interfaces/product.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { HttpResponse } from '@angular/common/http';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {

  createProductform: FormGroup;
  isProcessing : boolean = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private snackbar: MySnackbarService
  ) {}

  ngOnInit(): void {
    this.createProductform = new FormGroup({
      productName: new FormControl(null, Validators.required),
      productCode: new FormControl(null, Validators.required),
      rentPrice: new FormControl(null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])),
      rentUnit: new FormControl('1'),
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.createProductform.controls[controlName].hasError(errorName);
  }

  // getProductNameError(){
  //   return this.createProductform.value.productName.hasError('required') ? 'You must enter a value' : '';
  // }
  SaveProduct() {
    this.isProcessing = true;
    var model: CreateProductDto = {
      name: this.createProductform.value.productName,
      code: this.createProductform.value.productCode,
      rentPrice: Number(this.createProductform.value.rentPrice),
      rentUnit: Number(this.createProductform.value.rentUnit),
    };
    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.productCreate, model)
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status == 204 || resp.status == 200) {
            this.snackbar.SuccessfullToast();
            this.router.navigate(['/products']);
          } else
            this.snackbar.confirmToast(
              'Error ' + resp.status + ': When response is ok'
            );
            this.isProcessing = false;
        },
        (err: string) => {
          this.isProcessing = false;
          this.snackbar.confirmToast(err);
        }
      );
  }
}
