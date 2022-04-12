import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSource } from 'src/app/infrastructure/api-source';
import {
  ProductDto,
  UpdateProductDto,
} from 'src/app/infrastructure/interfaces/product.interface';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent implements OnInit {
  updateProductform: FormGroup;
  product: ProductDto;
  productId: number;
  productName: string;
  isProcessing : boolean = false;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MySnackbarService
  ) {
    this.product = {} as ProductDto;
  }

  ngOnInit(): void {
    this.updateProductform = new FormGroup({
      productName: new FormControl(null, Validators.required),
      productCode: new FormControl(null, Validators.required),
      rentPrice: new FormControl(null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])),
      rentUnit: new FormControl('1'),
    });

    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isProcessing = true;
      this.httpService
        .getSecureDefault<ProductDto>(
          ApiSource._base + ApiSource.productItem + this.productId
        )
        .subscribe(
          (resp) => {
            this.product = resp;
            this.productName = resp.name;
            this.updateProductform = new FormGroup({
              productName: new FormControl(
                this.product.name,
                Validators.required
              ),
              productCode: new FormControl(
                this.product.code,
                Validators.required
              ),
              rentPrice: new FormControl(
                this.product.rentPrice,
                Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])
              ),
              rentUnit: new FormControl(String(this.product.rentUnit)),
            });
            this.isProcessing = false;
          },
          (err: string) => {
            this.snackbar.confirmToast(err);
            //this.isProcessing = false;
          }
        );
    }
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.updateProductform.controls[controlName].hasError(errorName);
  }

  UpdateProduct() {
    this.isProcessing = true;
    var model: UpdateProductDto = {
      id: this.product.id,
      name: this.updateProductform.value.productName,
      code: this.updateProductform.value.productCode,
      rentPrice: Number(this.updateProductform.value.rentPrice),
      rentUnit: Number(this.updateProductform.value.rentUnit),
    };
    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.ProductUpdate, model)
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
          this.snackbar.confirmToast(err);
          this.isProcessing = false;
        }
      );
  }
}
