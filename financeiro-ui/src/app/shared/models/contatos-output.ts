import { TiposContatos } from './tipos-contatos';

export default interface EnderecosOutput {

  id?: number,
  contato?: number,
  usuario?: string,

  tiposContatos: TiposContatos

}
