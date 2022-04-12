import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSource } from '../infrastructure/api-source';
import { FilterDto, PaginatorDto } from '../infrastructure/interfaces/global.interface';
import { RentDto } from '../infrastructure/interfaces/rent.interface';
import { MyDialogService } from '../infrastructure/services/dialog.service';
import { HttpService } from '../infrastructure/services/http.service';
import { LocalizeService } from '../infrastructure/services/localize.service';
import { MySnackbarService } from '../infrastructure/services/snackbar.service';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css'],
})
export class RentComponent implements OnInit,AfterViewInit {
  loader: boolean = false;
  //rentList: RentDto[] = [];
  filters: FilterDto[] = [];
  hasFilter: boolean = false;

  routeQuery_customerId: string;
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    '#',
    'customerFullName',
    'customerMobileNumber',
    'rentDateTime',
    'returnDateTime',
    'finalCost',
    'isTerminated',
    'operations',
  ];
  rentDataSource = new MatTableDataSource([] as RentDto[]);
  constructor(
    private httpService: HttpService,
    private dialogService: MyDialogService,
    private snackbar: MySnackbarService,
    private apiSource: ApiSource,
    private route: ActivatedRoute,
    private router: Router,
    public localService:LocalizeService
  ) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    
    this.routeQuery_customerId = this.route.snapshot.params['customerQuery'];
    this.getRents(0,this.pageSize,this.routeQuery_customerId);
  }
  ngAfterViewInit() {
    this.rentDataSource.sort = this.sort;
  }

  checkFilterExist(key : string) : boolean{
    var filter = this.filters.find(x=>x.key == key);
    if(filter) return true;
    return false;
  }
  getFilterValue(key : string) : string{
    var filter = this.filters.find(x=>x.key == key);
    if(filter) return filter.value;
    return "";
  }
  removeCustomerFilter(){
    this.router.navigate(['/contracts/c-0']);
  }
  onPaging(event : PageEvent){
    this.getRents(event.pageIndex,event.pageSize,this.routeQuery_customerId); 
  }
  
  openRentItemDialog(element: RentDto): void {
    this.dialogService.open(RentItemsDialogComponent,'700px',element)
    .afterClosed()
    .subscribe(()=>{
      console.log('The dialog was closed');
    });
  }


  private getRents(pageIndex: number, pageSize: number, customerQuery: string) {
    this.loader = true;
    this.httpService
      .getSecureDefault<PaginatorDto<RentDto[]>>(ApiSource._base + this.apiSource.rentListApi(pageIndex, pageSize,customerQuery))
      .subscribe(
        (resp : PaginatorDto<RentDto[]>) => {
          
          this.rentDataSource.data = resp.items;

          this.length = resp.length;
          this.pageSize = resp.pageSize;
          this.pageIndex = resp.pageIndex;
          this.filters = resp.filters;
          this.hasFilter = resp.hasFilter;
          this.loader = false;
        },
        (err : string) => {
          this.loader = false;
          this.snackbar.confirmToast(err);
        }
      );
  }
}

@Component({
  selector: 'rent-items-dialog',
  templateUrl: 'rent-items.dialog.html',
})
export class RentItemsDialogComponent {
  displayedColumns: string[] = [
    '#',
    'ProductName',
    'PriceWhenRenting',
    'UnitWhenRenting',
  ];
  constructor(
    public dialogRef: MatDialogRef<RentItemsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RentDto,
    public localService:LocalizeService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
