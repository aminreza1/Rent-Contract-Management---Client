export interface ProductDto {
  id: number;
  name: string;
  rentPrice: number;
  rentUnit: number;
  rentUnitText: string;
  code: string;
  maxUnitForRent: number;
  minUnitForRent: number;
}
export interface CreateProductDto {
  name: string;
  code: string;
  rentPrice: number;
  rentUnit: number;
}
export interface UpdateProductDto {
  id: number;
  name: string;
  code: string;
  rentPrice: number;
  rentUnit: number;
}
