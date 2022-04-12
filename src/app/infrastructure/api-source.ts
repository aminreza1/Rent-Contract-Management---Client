import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiSource {

  public static _base: string = 'https://localhost:44344/api/';
  //public static _base: string = 'https://api.rcms.aminreza.info/api/';

  // Account (Authentication) APIs
  public static login: string = 'account/token';
  public static register: string = 'account/register';

  // Product APIs
  public productListApi(pageIndex: number, pageSize: number): string {
    return 'product/list?pageIndex=' + pageIndex + '&pageSize=' + pageSize;
  }
  public static productItem: string = 'product/find/'; // Need to ID
  public static productCreate: string = 'product/create';
  public static ProductUpdate: string = 'product/update';
  public static ProductChangeActivition: string = 'product/change/activation';

  // Rent APIs
  public rentListApi(
    pageIndex: number,
    pageSize: number,
    customerQuery: string
  ): string {
    return (
      'rent/list?pageIndex=' +
      pageIndex +
      '&pageSize=' +
      pageSize +
      '&customerQuery=' +
      customerQuery
    );
  }
  public static rentItem: string = 'rent/find/'; // Need to ID
  public static rentProductList: string = 'rent/products';
  public static rentCustomerList: string = 'rent/customers';
  public static rentAdd: string = 'rent/add';
  public static rentTerminate: string = 'rent/terminate';

  // Customer APIs
  public customerListApi(pageIndex: number, pageSize: number): string {
    return 'customer/list?pageIndex=' + pageIndex + '&pageSize=' + pageSize;
  }
  public static customerItem: string = 'customer/find/'; // Need to ID
  public static customerCreate: string = 'customer/create';
  public static customerUpdate: string = 'customer/update';

  // Setting APIs
  public static settingList: string = 'option/get';
  public static settingUpdate: string = 'option/update';

  // User APIs
  public userListApi(pageIndex: number, pageSize: number): string {
    return 'user/list?pageIndex=' + pageIndex + '&pageSize=' + pageSize;
  }
  public static userRolesForOperation: string = 'user/roles';
  public static userItem: string = 'user/find/'; // /userName
  public static userCreate: string = 'user/create';
  public static userUpdate: string = 'user/update';
}
