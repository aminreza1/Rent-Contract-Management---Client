export interface CustomerDto {
    id: number;
    firstName: string;
    lastName: string;
    nationalCode: string;
    phone: string;
    mobile: string;
    address: string;
    hasActiveRent: boolean;
  }
  export interface CreateCustomerDto {
    firstName: string;
    lastName: string;
    nationalCode: string;
    phone: string;
    mobile: string;
    address: string;
  }
  export interface UpdateCustomerDto {
    id: number;
    firstName: string;
    lastName: string;
    nationalCode: string;
    phone: string;
    mobile: string;
    address: string;
  }
  