import { TiposDocumentos } from "./tipos-documentos";

export default interface DocumentosOutput {

  id?: number,
  numeroDocumento?: string,
  usuario?: string,
  dataDocumento?: Date,
  dataExpedicao?: Date,
  documentoOrigem?: string,
  orgaoExpedidor?: string,
  numeroRegistroCnh?: string,
  dataPrimeiraCnh?: Date,
  dataValidadeCnh?: Date,
  categoriaCnh?: string,
  tituloEleitoral?: number,
  zona?: number,
  secao?: number,
  termo?: string,
  folha?: string,
  livro?: string,
  dtEmisCert?: Date,
  ufCartorio?: number,
  cidadeCartorio?: number,
  cartorio?: number,

  tiposDocumentos?: TiposDocumentos

}
