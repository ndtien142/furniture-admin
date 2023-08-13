import { IMetaResponse } from '../../product/common/interface.common';

export interface ICategory {
  id: number;
  name: string;
  description: string;
}

export interface ICategoryResponse {
  status: string;
  message: string;
  data: {
    items: ICategory[];
    meta: IMetaResponse;
  };
}
