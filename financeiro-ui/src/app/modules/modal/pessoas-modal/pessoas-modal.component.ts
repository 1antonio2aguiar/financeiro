import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { LazyLoadEvent } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';

import { Pessoas } from 'src/app/shared/models/pessoas';
import { PessoasModalFiltro } from './pessoas-modal-filtro';
import { PessoasModalService } from '../pessoas-modal.service';

@Component({
  selector: 'app-pessoas-modal',
  templateUrl: './pessoas-modal.component.html',
  styleUrls: ['./pessoas-modal.component.css']
})

export class PessoasModalComponent extends BaseResourceListComponent<Pessoas> {

  filtro = new PessoasModalFiltro;
  resources = [];
  loading = true;

  constructor(

    private pessoasModalService: PessoasModalService,
    public confirmationService: ConfirmationService,
    public messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig

  ) {
    super(pessoasModalService, confirmationService, messageService);
  }

   pesquisar(pagina = 0) {
      this.filtro.pagina = pagina;

      //console.log("ESTA NO pesquisar pessoas-modal.componensts ")

      this.pessoasModalService.pesquisar(this.filtro)
         .then(resultado => {
         this.loading = false;
         this.filtro.totalRegistros = resultado.total;
         this.resources = resultado.pessoas;
         })
         .catch(erro => {
         erro = 'Erro';
         this.loading = false;
         }
      );
   }

   aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event.first / event.rows;
      this.filtro.params = new HttpParams();

      if (event.filters.id) {
         this.filtro.params = this.filtro.params.append('id', event.filters.id.value);
      }

      if (event.filters.nome) {
         this.filtro.params = this.filtro.params.append('nome', event.filters.nome.value);
      }

      if (event.filters.documento) {
         this.filtro.params = this.filtro.params.append('pessoasFilter.cpf', event.filters.cpf.value);
      }
   }

   selecItem(pessoas){
      this.ref.close(pessoas);
   }

}

