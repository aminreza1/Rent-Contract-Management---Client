export interface PaginatorDto<T> {
  items: T;
  length: number;
  pageIndex: number;
  pageSize: number;
  hasFilter: boolean;
  filters: FilterDto[]
}

export interface FilterDto {
  key: string;
  value: string;
  ValueId: number;
}
// export interface StandardHttpResponseDtoNoData {
//   message: string;
//   succeed: boolean;
//   statusCode: number;
// }


