import { BaseResourceModel } from './base-resource.model';

export class TiposEnderecos extends BaseResourceModel {
  constructor(
    public descricao?: string,
    public id?: number,
  ) {
    super();
  }
  static fromJson(jsonData: any): TiposEnderecos {
      return Object.assign(new TiposEnderecos(), jsonData);
  }
}
