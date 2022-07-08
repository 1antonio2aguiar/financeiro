import { Logradouros } from 'src/app/shared/models/logradouros';
import { TiposEnderecos } from './tipos-enderecos';
import { Bairros } from './bairros';
import { Ceps } from './ceps';

export default interface EnderecosOutput {

  id?: number,
  cep?: number,
  numero?: number,
  complemento?: string,
  usuario?: string,

  tiposEnderecos: TiposEnderecos,
  bairros: Bairros,
  logradouros: Logradouros,
  ceps: Ceps,
}
