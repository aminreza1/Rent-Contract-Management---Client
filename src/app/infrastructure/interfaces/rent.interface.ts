export interface RentDto {
  id: number;
  customerFullName: string;
  customerMobileNumber: string;
  rentDateTime: string;
  isTerminated: boolean;
  returnDateTime: string;
  finalCost: number;
  predictedCost: number;
  calculatedCost: number;
  description: string;
  items: RentItemDto[];
}

export interface RentItemDto {
  rentId: number;
  productName: string;
  productId: number;
  priceWhenRenting: string;
  unitWhenRenting: string;
  rentPrice: number;
  rentUnitText: string;
  calculatedCost: number;
}

export interface NewRentDto {
  customerId: number;
  predictedCost: number;
  description: string;
  productIds: number[];
}

export interface CustomerListInNewRentDto {
  id: number;
  fullName: string;
  mobile: string;
}

export interface TerminateRentDto {
  id: number;
  finalCost: number;
  IsTerminated: boolean;
}
