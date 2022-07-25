import { Component, Injector, Input, Output, EventEmitter } from '@angular/core';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { MessageService} from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { Validators, FormGroup, FormControlName } from '@angular/forms';
import { DialogService, DynamicDialogRef, TreeModule } from 'primeng';
import * as moment from 'moment';

import { environment } from 'src/environments/environment';

import { Documentos } from './../../../../shared/models/documentos';
import { DocumentosService } from '../documentos.service';
import { PessoasModalComponent } from '../../../modal/pessoas-modal/pessoas-modal.component';

@Component({
   selector: 'app-documentos-modal',
   templateUrl: './documentos-modal.component.html',
   styleUrls: ['./documentos-modal.component.css']
})

export class DocumentosModalComponent extends BaseResourceFormComponent<Documentos> {

   // acho que isso e o gabriel que pos por conta do modal bloqueando tela
   @Output() closeModalEvent = new EventEmitter<boolean>();
   private documentos: Documentos;

   env = environment;
   documentoId = 0;
   tipoDocumento = {value: 0};
   maxDate = new Date();
   cpfCnpj = '';

   tiposDocumentosList = [
      { value: 'RG', selected: false, label: 'REGISTRO GERAL - RG' },
      { value: 'CTPS', selected: false, label: 'CARTEIRA DE TRABALHO PROFISSIONAL' },
      { value: 'CNH', selected: false, label: 'CARTEIRA NACIONAL DE HABILITAÇÃO' },
      { value: 'RESERVISTA', selected: false, label: 'RESERVISTA' },
      { value: 'PASSAPORTE', selected: false, label: 'PASSAPORTE' },
      { value: 'TITELEITOR', selected: false, label: 'TÍTULO DE ELEITOR' },
      { value: 'INSCRIMUNICIPAL', selected: false, label: 'INSCRIÇÃO MUNICIPAL' },
      { value: 'OUTRO', selected: false, label: 'OUTRO' }
   ];

   //Move os dados da pessoas para o modal de cadastro de Documentos
   //dadosPessoa=(<HTMLSelectElement>document.getElementById('nome')).value +' CPF: ' +
   //     (<HTMLSelectElement>document.getElementById('cpf')).value

   ptBrLocale;

   constructor(
      protected documentosService: DocumentosService,
      protected injector: Injector,
      public messageService: MessageService,
      public dialogService: DialogService ,
      public ref: DynamicDialogRef,
   ) {
      super(injector, new Documentos(), documentosService, Documentos.fromJson, new MessageService());

      this.ptBrLocale = this.loadLocale();
      this.buildResourceForm(); /*limpa o formulario/resourceForm */

      if (this.env.currentActionGlobal != "DELETE"){
         this.env.botaoOnOf = false;
      } else {
         this.env.botaoOnOf = true;
      }

   }

   protected buildResourceForm() {
      this.resourceForm = this.formBuilder.group({

         id: [null],
         pessoaId: [(<HTMLSelectElement>document.getElementById('id')).value],

         numeroDocumento:[null,Validators.required, Validators.minLength(5)],

         dataDocumento: [null],
         dataExpedicao: [null],
         dataValidade:  [null],

         tiposDocumentos:[null],

         idPessoas: this.formBuilder.group({
            dadosPf: this.formBuilder.group({
              cpfCnpj: [null],
              cpf: [null],
            }),
            id: [null, [Validators.required]],
            nome: [null],
          }),
      })
   }

   submitForm() {
      //this.submittingForm = true;
      if (this.env.currentActionGlobal === 'NEW') {
         // clicou no + (novo)
         this.createResource();
      } else {
         if (this.env.currentActionGlobal === 'EDIT') {
         // clicou no update
         this.updateResource();
         } else {
         // clicou no delete
         this.deleteResource();
         }
      }
   }

   protected deleteResource(){
      this.documentosService.deleteDocumento(this.documentoId)
      .then(response => {
         this.buildResourceForm(); /*limpa o formulario/resorceForm*/
         this.ref.close();
      })
   }

   protected updateResource(){
      const replacer = function (key, value) {
         if (this[key] instanceof Date) {
         //console.log('ENTROU RESOLVER DATA ' + moment(this[key]).format('DD/MM/YYYY'))
         return moment(this[key]).format('DD/MM/YYYY');
         }
         return value;
      };

      const resource: Documentos = this.jsonDataToResourceFn(this.resourceForm.value);

      // copia os dados de Documentos(classe) para Documentos(variavel json)
      let documentos = JSON.stringify(resource,replacer);

      // Chama a funcao que faz update
      this.documentosService.updateDocumento(documentos)
      .then(response => {
         this.buildResourceForm(); /*limpa o formulario/resorceForm*/
         this.ref.close();
      })
   }

   protected createResource() {
      const replacer = function (key, value) {
         if (this[key] instanceof Date) {
         //console.log('ENTROU RESOLVER DATA ' + moment(this[key]).format('DD/MM/YYYY'))
         return moment(this[key]).format('DD/MM/YYYY');
         }
         return value;
      };

      const resource: Documentos = this.jsonDataToResourceFn(this.resourceForm.value);
      // copia os dados de Documentos(classe) para Documentos(variavel json)
      let documentos = JSON.stringify(resource,replacer);

      // Chama a funcao que insere
      this.documentosService.createDocumento(documentos)
      .then(response => {
         this.buildResourceForm(); /*limpa o formulario/resorceForm*/
         this.ref.close();
      }).
         catch(error => {
         console.log(error);
         this.messageService.add({severity:'error', summary: 'Erro', detail:error.error[0].mensagemUsuario});
      });
   }

   fecharModal(){
      this.ref.close();
   }

   // Modal Pessoas
   showPessoas($event) {

      const ref = this.dialogService.open(PessoasModalComponent, {
      header: 'Selecione a Pessoa',
      width: '70%'
      });

      ref.onClose.subscribe((pessoa) => {

      if (pessoa.fisicaJuridica ==  'J'){
         this.cpfCnpj = pessoa.dadosPjGeral.cnpj
         this.cpfCnpj = this.cpfCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
      } else {
         this.cpfCnpj = pessoa.dadosPfGeral.cpf
         this.cpfCnpj = this.cpfCnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      }

      this.resourceForm.patchValue({
         idPessoas: {
            dadosPf:{
            cpfCnpj: this.cpfCnpj,
            cpf: this.cpfCnpj,
            },
            id: pessoa.id,
            nome: pessoa.nome,
         },
         idPessoa: pessoa.id
      });
      });
   }


}
