import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiSource } from '../infrastructure/api-source';
import { PaginatorDto } from '../infrastructure/interfaces/global.interface';
import { UserDto } from '../infrastructure/interfaces/user.interface';
import { HttpService } from '../infrastructure/services/http.service';
import { LocalizeService } from '../infrastructure/services/localize.service';
import { MySnackbarService } from '../infrastructure/services/snackbar.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, AfterViewInit {
  
  loader: boolean = false;
 
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    '#',
    'userName',
    'lastName',
    'mobile',
    'email',
    'createDateTime',
    'roles',
    'isBlock',
    'operations',
  ];
  userDataSource = new MatTableDataSource([] as UserDto[]);

  constructor(
    private httpService: HttpService,
    private snackbar: MySnackbarService,
    private apiSource: ApiSource,
    public localService:LocalizeService
  ) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getUsers(0, this.pageSize);
  }

  ngAfterViewInit() {
    this.userDataSource.sort = this.sort;
  }

  onPaging(event: PageEvent) {
    this.getUsers(event.pageIndex, event.pageSize);
  }

  private getUsers(pageIndex: number, pageSize: number) {
    this.loader = true;
    this.httpService
      .getSecureDefault<PaginatorDto<UserDto[]>>(
        ApiSource._base + this.apiSource.userListApi(pageIndex, pageSize)
      )
      .subscribe(
        (resp: PaginatorDto<UserDto[]>) => {
          this.userDataSource.data = resp.items;

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
