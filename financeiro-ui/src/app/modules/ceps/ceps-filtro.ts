import { HttpParams } from '@angular/common/http';

export class CepsFiltro {
    pagina = 0;
    itensPorPagina = 9;
    totalRegistros = 0;
    params = new HttpParams();
}
