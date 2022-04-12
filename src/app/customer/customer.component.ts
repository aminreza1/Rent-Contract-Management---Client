import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiSource } from '../infrastructure/api-source';
import { CustomerDto } from '../infrastructure/interfaces/customer.interface';
import { PaginatorDto } from '../infrastructure/interfaces/global.interface';
import { HttpService } from '../infrastructure/services/http.service';
import { MySnackbarService } from '../infrastructure/services/snackbar.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, AfterViewInit {

  //customerList: CustomerDto[] = [];
  loader: boolean = false;

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    '#',
    'lastName',
    'mobile',
    'phone',
    'activeContract',
    'operations',
  ];
  customerDataSource = new MatTableDataSource([] as CustomerDto[]);
  
  constructor(
    private httpService: HttpService,
    private snackbar: MySnackbarService,
    private apiSource: ApiSource) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getCustomers(0,this.pageSize);
  }

  ngAfterViewInit() {
    this.customerDataSource.sort = this.sort;
  }

  onPaging(event : PageEvent){
    this.getCustomers(event.pageIndex,event.pageSize); 
  }
  
  private getCustomers(pageIndex: number, pageSize: number) {
    this.loader = true;
    this.httpService
      .getSecureDefault<PaginatorDto<CustomerDto[]>>(ApiSource._base + this.apiSource.customerListApi(pageIndex, pageSize))
      .subscribe(
        (resp : PaginatorDto<CustomerDto[]>) => {
          this.customerDataSource.data = resp.items;

          this.length = resp.length;
          this.pageSize = resp.pageSize;
          this.pageIndex = resp.pageIndex;
          this.loader = false;
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
          this.loader = false;
        }
      );
  }
}
