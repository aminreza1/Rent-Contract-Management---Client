import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiSource } from 'src/app/infrastructure/api-source';
import {
  CustomerListInNewRentDto,
  NewRentDto,
  RentItemDto,
} from 'src/app/infrastructure/interfaces/rent.interface';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-add-rent',
  templateUrl: './add-rent.component.html',
  styleUrls: ['./add-rent.component.css'],
})
export class AddRentComponent implements OnInit {
  addRentContractform: FormGroup;
  allProducts: RentItemDto[] = [];

  customerMobile = new FormControl();
  customerFormControl = new FormControl();

  allCustomers: CustomerListInNewRentDto[] = [];
  filteredCustomers: Observable<CustomerListInNewRentDto[]>;
  selectedCustomer: CustomerListInNewRentDto | null;

  productLength: number;
  selectedProducts: RentItemDto[] = [];
  selectedProductsDataSource: MatTableDataSource<RentItemDto>;
  filteredProductsDataSource: MatTableDataSource<RentItemDto>;
  displayedColumns: string[] = [
    '#',
    'productName',
    'priceWhenRenting',
    'unitWhenRenting',
    'operations',
  ];
  customerSelected: boolean = false;
  isProcessing : boolean = false;
  
  constructor(
    private httpService: HttpService,
    private router: Router,
    private snackbar: MySnackbarService
  ) {}

  ngOnInit(): void {
    //this.filteredProductsDataSource = new MatTableDataSource(this.filteredProducts);
    this.selectedProductsDataSource = new MatTableDataSource(
      this.selectedProducts
    );

    this.addRentContractform = new FormGroup({
      predictedCost: new FormControl(null),
      description: new FormControl(null),
    });

    this._initialProducts();
    this._initialCustomers();

    this.filteredCustomers = this.customerFormControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCustomer(value))
    );
  }

  SaveContract() {
    this.isProcessing = true;
    var model: NewRentDto = {
      customerId: this.selectedCustomer?.id ?? 0,
      predictedCost: Number(this.addRentContractform.value.predictedCost),
      description: this.addRentContractform.value.description,
      productIds: this.selectedProducts.map((x) => x.productId),
    };

    console.log(model);

    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.rentAdd, model)
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status == 204 || resp.status == 200) {
            this.snackbar.SuccessfullToast();
            this.router.navigate(['/contracts/c-0']);
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

  onSearch(query: HTMLInputElement) {
    this.filteredProductsDataSource.data = query.value
      ? this._filterProduct(query.value)
      : this.allProducts.slice();
    for (let item of this.selectedProducts) {
      const index = this.filteredProductsDataSource.data.indexOf(item);
      if (index >= 0) this.filteredProductsDataSource.data.splice(index, 1);
    }
    this.filteredProductsDataSource._updateChangeSubscription();
  }

  onAddToSelectedList(item: RentItemDto) {
    if (item) {
      this.selectedProducts.push(item);
      this.selectedProductsDataSource._updateChangeSubscription();
      const index2 = this.filteredProductsDataSource.data.indexOf(item);
      if (index2 >= 0) this.filteredProductsDataSource.data.splice(index2, 1);
      this.filteredProductsDataSource._updateChangeSubscription();
    }
  }

  onRemoveFromSelectedList(item: RentItemDto) {
    if (item) {
      this.filteredProductsDataSource.data.push(item);
      this.filteredProductsDataSource._updateChangeSubscription();
      const index = this.selectedProducts.indexOf(item);
      if (index >= 0) this.selectedProducts.splice(index, 1);
      this.selectedProductsDataSource._updateChangeSubscription();
    }
  }

  onCustomerSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedCustomer = event.option.value;
    this.customerMobile.setValue(this.selectedCustomer?.mobile);
    if (this.selectedCustomer) this.customerSelected = true;
  }
  onRemoveCustomer(){
    this.selectedCustomer = null;
    this.customerMobile.setValue('');
    this.customerFormControl.setValue('');
    if (!this.selectedCustomer) this.customerSelected = false;
  }
  getCustomerViewValue(item: CustomerListInNewRentDto) {
    if (item) return item.fullName;
    else return '';
  }

  private _filterProduct(value: string): RentItemDto[] {
    value = value ? value.toLowerCase() : '';
    return this.allProducts.filter((i: RentItemDto) =>
      i.productName.toLowerCase().includes(value)
    );
  }

  private _filterCustomer(value: string): CustomerListInNewRentDto[] {
    let value1 = value.toString().toLowerCase();

    return this.allCustomers.filter((option) =>
      option.fullName.toLowerCase().includes(value1)
    );
  }

  private _initialProducts() {
    this.httpService
      .getSecureDefault<RentItemDto[]>(
        ApiSource._base + ApiSource.rentProductList
      )
      .subscribe(
        (response) => {
          this.allProducts = response;
          this.productLength = response.length;
          this.filteredProductsDataSource = new MatTableDataSource(response);
        },
        (err: string) => {
          this.productLength = -1;
          this.snackbar.confirmToast(err);
        }
      );
  }

  private _initialCustomers() {
    this.httpService
      .getSecureDefault<CustomerListInNewRentDto[]>(
        ApiSource._base + ApiSource.rentCustomerList
      )
      .subscribe(
        (response) => {
          this.allCustomers = response;
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
        }
      );
  }
}
