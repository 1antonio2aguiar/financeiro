
import { BaseResourceModel } from './base-resource.model';

export class Documentos extends BaseResourceModel {
  constructor(
    public id?: number,
    public pessoa?: number,
    public tipoDocumento?: number,
    public numeroDocumento?: string,
    public documentoOrigem?: string,
    public dataDocumento?: Date,
    public dataExpedicao?: Date,
    public orgaoExpedidor?: string,
    public numeroRegistroCnh?: string,
    public dataPrimeiraCnh?: Date,
    public dataValidadeCnh?: Date,
    public categoriaCnh?: string,
    public tituloEleitoral?: number,
    public zona?: number,
    public secao?: number,
    public termo?: string,
    public folha?: string,
    public livro?: string,
    public dtEmisCert?: Date,
    public ufCartorio?: number,
    public cidadeCartorio?: number,
    public cartorio?: number,
    public usuario?: string,

  ) {
    super();
  }
  static fromJson(jsonData: any): Documentos {
    return Object.assign(new Documentos(), jsonData);
  }
}

