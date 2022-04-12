import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { ApiSource } from '../infrastructure/api-source';
import { PaginatorDto } from '../infrastructure/interfaces/global.interface';
import { ProductDto } from '../infrastructure/interfaces/product.interface';
import { HttpService } from '../infrastructure/services/http.service';
import { MySnackbarService } from '../infrastructure/services/snackbar.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  //productList: ProductDto[] = [];
  loader: boolean = false;

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    '#',
    'code',
    'name',
    'rentPrice',
    'rentUnitText',
    'minUnitForRent',
    'maxUnitForRent',
    'operations',
  ];
  productDataSource = new MatTableDataSource([] as ProductDto[]);

  constructor(
    private httpService: HttpService,
    private snackbar: MySnackbarService,
    private apiSource: ApiSource
  ) {}
  
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
   this.getProducts(0, this.pageSize);
  }

  ngAfterViewInit() {
      this.productDataSource.sort = this.sort;
  }

  onPaging(event: PageEvent) {
    this.getProducts(event.pageIndex, event.pageSize);
  }

  private getProducts(pageIndex: number, pageSize: number) {
    this.loader = true;
    this.httpService
      .getSecureDefault<PaginatorDto<ProductDto[]>>(
        ApiSource._base + this.apiSource.productListApi(pageIndex, pageSize)
      )
      .subscribe(
        (resp: PaginatorDto<ProductDto[]>) => {
          this.productDataSource.data = resp.items;

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
