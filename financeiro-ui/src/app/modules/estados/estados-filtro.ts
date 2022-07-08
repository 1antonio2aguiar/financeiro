import { HttpParams } from '@angular/common/http';

export class EstadosFiltro {
    pagina = 0;
    itensPorPagina = 9;
    totalRegistros = 0;
    params = new HttpParams();
}
