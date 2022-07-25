import { Injectable, Injector } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseResourceService } from './../../shared/services/base-resource.service';

import { PessoasModalFiltro } from './pessoas-modal/pessoas-modal-filtro';
import { Pessoas } from 'src/app/shared/models/pessoas';

@Injectable({
  providedIn: 'root'
})


export class PessoasModalService extends BaseResourceService<Pessoas>{

   header = new HttpHeaders({
      'Content-Type': 'application/json'
   });

   constructor(
      protected injector: Injector
   ) {
      super(environment.apiUrl + 'pessoas', injector, Pessoas.fromJson);
   }

   pesquisar(filtro: PessoasModalFiltro): Promise<any> {

      let params = filtro.params;
      params = params
         .append('page', filtro.pagina.toString())
         .append('size', filtro.itensPorPagina.toString());
      return this.http.get<any>(
         this.apiPath,
         { params }
      )
         .toPromise()
         .then(response => {
         const pessoas = response.content;
         const resultado = {
            pessoas,
            total: response.totalElements
         };
         return resultado;
      });
  }

  listAll(): Promise<any> {

    //console.log("ESTA NO LIST ALL pessoas-modal.SERVICE ")
    //console.log('ATENÇÃO !! ', this.apiPath)

    return this.http.get<any>(this.apiPath + '/')
      .toPromise()
      .then(response => response.content);
  }

}
