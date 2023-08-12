export interface IPageAndLimitParams {
  page: number;
  limit: number;
}

export interface IMetaResponse {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface IProduct {
  categoryId: number;
  description: string;
  imageUrl: string;
  isActive: false;
  name: string;
  price: number;
  qty: string;
  suplierId: number;
  unit: string;
}
