import { Component, Injector, Input, Output, EventEmitter } from '@angular/core';
import { MessageService} from 'primeng/api';
import { BaseResourceFormComponent } from '../../../../shared/components/base-resource-form/base-resource-form.component';
import { SelectItem } from 'primeng/api';
import { Validators, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng';

import { environment } from 'src/environments/environment';

import { Enderecos } from './../../../../shared/models/enderecos';
import { EnderecosService } from '../enderecos.service';
import { CidadesModalComponent } from '../../../cidades/cidades-modal/cidades-modal.component';
import { BairrosModalComponent } from './../../../bairros/bairros-modal/bairros-modal.component';
import { LogradourosModalComponent } from './../../../logradouros/logradouros-modal/logradouros-modal.component'
import { CepsModalComponent } from '../../../ceps/ceps-modal/ceps-modal.component';

@Component({
   selector: 'app-enderecos-modal',
   templateUrl: './enderecos-modal.component.html',
   styleUrls: ['./enderecos-modal.component.css']
})

export class EnderecosModalComponent extends BaseResourceFormComponent<Enderecos>{
   // acho que isso e o gabriel que pos por conta do modal bloqueando tela
   // Já testei não é isso que faz o modal fechar.
   @Output() closeModalEvent = new EventEmitter<boolean>();
   private enderecos: Enderecos;

   tiposEnderecosList = [
      { value: 'R', selected: false, label: 'RESIDENCIAL' },
      { value: 'C', selected: false, label: 'COMERCIAL' }
   ];

   env = environment;
   enderecoId = 0;

   masks = {
      mask: [
         {
         mask: '00.000-000'
         }
      ]
   };

   tipoLogradouroList: SelectItem[];

   //Move os dados da pessoas para o modal de cadastro de enderecos
   dadosPessoa=(<HTMLSelectElement>document.getElementById('nome')).value +' CPF: ' +
   (<HTMLSelectElement>document.getElementById('cpfCnpj')).value

   constructor(

      protected enderecosService: EnderecosService,
      protected injector: Injector,
      public messageService: MessageService,
      public dialogService: DialogService ,
      public ref: DynamicDialogRef,

   ) {
      super(injector, new Enderecos(), enderecosService, Enderecos.fromJson, new MessageService());

      //this.loadTipoLogradouro();
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
         pessoa: [(<HTMLSelectElement>document.getElementById('id')).value],

         tiposEnderecos:[null,[Validators.required]],

         cidades: this.formBuilder.group({
            estados: this.formBuilder.group({
               uf: [null]
            }),
            id: [null],
            nome: [null],
         }),

         bairros: this.formBuilder.group({
            id: [null, [Validators.required, Validators.maxLength(10)]],
            nome:[null],
         }),
         bairro:[null],

         logradouros: this.formBuilder.group({
            id: [null, [Validators.required, Validators.maxLength(15)]],
            nome: [null],
            tiposLogradouros: this.formBuilder.group({
               sigla: [null],
            })
         }),
         logradouro:[null],

         ceps: this.formBuilder.group({
            cep: [null],
         }),
         cep: [null],

         numero: [null, [Validators.required, Validators.minLength(1)]],
         complemento: [null]
      });
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
      }}
   }

   protected deleteResource(){
      this.enderecosService.deleteEndereco(this.enderecoId)
         .then(response => {
         this.buildResourceForm(); /*limpa o formulario/resorceForm*/
         this.ref.close();
      })
   }

   protected updateResource(){
      const resource: Enderecos = this.jsonDataToResourceFn(this.resourceForm.value);

      // copia os dados de Enderecos(classe) para enderecos(variavel json)
      let enderecos = JSON.stringify(resource);

      // Chama a funcao que faz update
      this.enderecosService.updateEndereco(enderecos)
         .then(response => {
         this.buildResourceForm(); /*limpa o formulario/resorceForm*/
         this.ref.close();
      })
   }

   protected createResource() {
      const resource: Enderecos = this.jsonDataToResourceFn(this.resourceForm.value);
      // copia os dados de Enderecos(classe) para enderecos(variavel json)
      let enderecos = JSON.stringify(resource);

      // Chama a funcao que insere
      this.enderecosService.createEndereco(enderecos)
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

   //Modal CEP
   showCeps($event){
      const ref = this.dialogService.open(CepsModalComponent, {
         header: 'Selecione o CEP',
         width: '70%'
      });

      ref.onClose.subscribe((cep) => {
         //console.log(cep);
         this.resourceForm.patchValue({
            ceps: {
               id: cep.id,
               cep: cep.cep
            },
            cep: cep.id
         })

         this.resourceForm.patchValue({
            cidades: {
               id: cep.bairros.cidades.id,
               nome: cep.bairros.cidades.nome,
               estados: {
                  sigla: cep.bairros.cidades.estados.sigla
               }
            }
         });

         this.resourceForm.patchValue({
            bairros: {
               id: cep.bairros.id,
               nome: cep.bairros.nome
            },
            bairro: cep.bairros.id
         });

         this.resourceForm.patchValue({
            logradouros: {
               id: cep.logradouros.id,
               nome: cep.logradouros.nome,

               tiposLogradouros:{
               sigla: cep.logradouros.tiposLogradouros.sigla
               }
            },
            logradouro: cep.logradouros.id
         });
      })
   }

   // Modal Cidade/distrito/estado
   showCidades($event) {

      const ref = this.dialogService.open(CidadesModalComponent, {
         header: 'Selecione a Cidade',
         width: '70%'
      });

      ref.onClose.subscribe((cidade) => {
         this.resourceForm.patchValue({
            cidades: {
               id: cidade.id,
               nome: cidade.nome,

               estados: {
                  uf: cidade.estados.uf
               }
            }
         });
      });
   }

   // Modal Bairro
   showBairros($event) {
      const ref = this.dialogService.open(BairrosModalComponent, {
         header: 'Selecione o Bairro',
         width: '70%',
         data:{
            // parte de filtrar bairros da cidade
            idCidade: this.resourceForm.get('cidades').get('id').value
         }
      });

      ref.onClose.subscribe((bairro) => {
         this.resourceForm.patchValue({
            bairros: {
               id: bairro.id,
               nome: bairro.nome
            }
         });
      });
   }

   // Modal Logradouro
   showLogradouros($event) {
      const ref = this.dialogService.open(LogradourosModalComponent, {
         header: 'Selecione o Logradouro',
         width: '70%',
         data:{
            // parte de filtrar logradouros da cidade
            idCidade: this.resourceForm.get('cidades').get('id').value
         }
      });

      ref.onClose.subscribe((logradouro) => {
         this.resourceForm.patchValue({
            logradouros: {
               id: logradouro.id,
               nome: logradouro.nome,

               tiposLogradouros:{
               sigla: logradouro.tiposLogradouros.sigla
               }
            }
         });
      });
   }

   // No edit retorna os dados aqui.
   ngOnInit(){

      this.enderecosService.enderecosEditSubscribeId(
      resources => {

         this.enderecoId = resources.id

         this.resourceForm.patchValue({
            tiposEnderecos:resources.tipoEndereco,

            cidades:{
               estados:{
                  sigla: resources.bairros.cidades.estados.sigla,
               },
               nome: resources.bairros.cidades.nome,
            },

            bairros:{
               id: resources.bairros.id,
               nome: resources.bairros.nome,
            },
            bairro: resources.bairros.id,

            logradouros:{
               id: resources.logradouros.id,
               nome: resources.logradouros.nome,
               tiposLogradouros:{
                  sigla: resources.logradouros.tiposLogradouros.sigla,
               }
            },
            logradouro: resources.logradouros.id,

            ceps:{
               id: resources.ceps.id,
               cep: resources.ceps.cep,
            },

            cep: resources.ceps.id,
            id: resources.id,
            numero: resources.numero,
            complemento: resources.complemento
         })
      }
      )

      if(this.env.currentActionGlobal === "DELETE"){
         (<HTMLSelectElement>document.getElementById('numero')).disabled = true;
         (<HTMLSelectElement>document.getElementById('complemento')).disabled = true;
         (<HTMLSelectElement>document.getElementById('btnCep')).style.display = "none";



      } else {
         (<HTMLSelectElement>document.getElementById('numero')).disabled = false;
         (<HTMLSelectElement>document.getElementById('complemento')).disabled = false;
         if(this.env.currentActionGlobal === "EDIT"){
            this.env.botaoOnOf = true;
         }
         //(<HTMLSelectElement>document.getElementById('btnCep')).style.display = "block";
      }

   }
}
