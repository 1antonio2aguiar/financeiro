import { SelectItem } from 'primeng/api';
import { DialogService } from 'primeng';
import { MessageService } from 'primeng/api';
import { Component, Injector, Input } from '@angular/core';
import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

import { PessoasService } from '../pessoas.service';
import { Pessoas } from './../../../shared/models/pessoas';
//import { TiposPessoasService } from './../../tipos-pessoas/tipos-pessoas.service';
//import { DistritosModalComponent } from './../../distritos/distritos-modal/distritos-modal.component';

import * as moment from 'moment';

@Component({
   selector: 'app-pessoas-cadastro-view',
   templateUrl: './pessoas-cadastro-view.component.html',
   styleUrls: ['./pessoas-cadastro-view.component.css'],

})

export class PessoasCadastroViewComponent extends BaseResourceFormComponent<Pessoas> {
   public myModel: string
   public modelWithValue: string
   public formControlInput: FormControl = new FormControl()
   public maskCpf: Array<string | RegExp>
   public maskCnpj: Array<string | RegExp>

   @Input() pessoaId: number;
   env = environment;
   cpf_cnpj = "";
   botaoOnOf = false;

   genero = [
      { value: 'M', selected: false, label: 'MASCULINO' },
      { value: 'F', selected: false, label: 'FEMININO' }
   ];

   fisicaJuridica = [
      { value: 'F', selected: true, label: 'FÍSICA' },
      { value: 'J', selected: false, label: 'JURÍDICA' }
   ];

   estadoCivil = [
      { value: 'A', selected: false, label: 'AMAZIADO(A)' },
      { value: 'C', selected: false, label: 'CASADO(A)' },
      { value: 'S', selected: false, label: 'SOLTEIRO(A)' },
      { value: 'U', selected: false, label: 'UNIÃO ESTÁVEL' },
      { value: 'V', selected: false, label: 'VIUVO(A)' },
      { value: 'O', selected: false, label: 'OUTRO' }
   ];

   situacao = [
      { value: 'A', selected: false, label: 'ATIVO' },
      { value: 'I', selected: false, label: 'INATIVO' },
      { value: 'P', selected: false, label: 'PARALISADO' },
      { value: 'S', selected: false, label: 'SUSPENSO' }
   ];

   ptBrLocale;

   constructor(
      protected pessoasService: PessoasService,
      protected injector: Injector,
      public dialogService: DialogService ,
      public messageService: MessageService,
   ) {

      super(injector, new Pessoas(), pessoasService, Pessoas.fromJson, new MessageService());
      this.ptBrLocale = this.loadLocale();

   }

   protected buildResourceForm() {
      this.resourceForm = this.formBuilder.group({
		   id: [null],
		   nome: [null, [Validators.required, Validators.minLength(5)]],
		   fisicaJuridica: ["F"],
		   dataRegistro: [null],
		   observacao: [null],

         /*tiposPessoas:
            this.formBuilder.group({
            descricao:[null],
            id: [null],
         }),*/

			cpfCnpj: [null],
			genero: [null],
			estadoCivil:[null],
		   situacao: ["A"],

         nomeFantasia: [null],
         objetoSocial: [null],
         tipoEmpresaId: [1]
      });

   }

   onChange(event) {
      if(event.value == 'F'){
         // Bloquea
         (<HTMLSelectElement>document.getElementById('nomeFantasia')).disabled = true;
         (<HTMLSelectElement>document.getElementById('objetoSocial')).disabled = true;
      } else {
         // Desbloqueia
         (<HTMLSelectElement>document.getElementById('nomeFantasia')).disabled = false;
         (<HTMLSelectElement>document.getElementById('objetoSocial')).disabled = false;
      }
   }

   public cpfcnpjmask = function () {
      var numbers = (<HTMLSelectElement>document.getElementById('cpfCnpj')).value.match(/\d/g);
      var numberLength = 0;
      if (numbers) {
        numberLength = numbers.join('').length;
      }
      if (numberLength <= 11) {
        return [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
      } else {
        return [/[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
      }
   }

   protected creationPageTitle(): string {
      //this.botaoOnOf = false;
      return 'Novo Cadastro de Pessoa Física';

   }

   protected editionPageTitle(): string {
      this.env.tabPanelOnOff = false;
      //this.botaoOnOf = true;
      return 'Editando Pessoas: ' ;
   }

   submitForm() {
      //this.submittingForm = true;
      if (this.currentAction === 'new') {
         // clicou no + (novo)
         this.createResource();
      } else {
         // clicou no update
         this.updateResource();
      }
   }

   /*protected updateResource() {
      const replacer = function (key, value) {
         if (this[key] instanceof Date) {
         //console.log('ENTROU RESOLVER DATA ' + moment(this[key]).format('DD/MM/YYYY'))
         return moment(this[key]).format('DD/MM/YYYY');
         }
         return value;
      };

      // Move o usuario para pessoas
      this.resourceForm.patchValue({
         usuario: JSON.parse(sessionStorage.getItem("usuario")).nome
      });

      const resource: Pessoas = this.jsonDataToResourceFn(this.resourceForm.value);
      // copia os dados de Pessoas para pessoas
      let pessoas = JSON.stringify(resource,replacer);

      // Chama a funcao que grava/ faz update
      this.pessoasService.updatePessoa(pessoas)
         .then(response => {
         this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Pessoa atualizada com sucesso!'});

         // redireciona para lista
         const baseComponentPath = this.route.snapshot.parent.url[0].path;
         this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(() => {
            console.log(this.router);
            return this.router.navigate(["/" + baseComponentPath]);
         });
         }).
         catch(error => {
         console.log(error);
         console.log('fail');
         this.messageService.add({severity:'error', summary: 'Erro', detail:error.error[0].mensagemUsuario});
      });
   }*/

   protected createResource() {
      const resource: Pessoas = this.jsonDataToResourceFn(this.resourceForm.value);
      // copia os dados de Pessoas para pessoas
      let pessoas = JSON.stringify(resource/*,replacer*/);

      // Chama a funcao que grava
      this.pessoasService.createPessoa(pessoas)
         .then(response => {
         this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Pessoa inserida com sucesso!'});

         // Move o id para pessoas
         this.resourceForm.patchValue({
            id: response.id
         });

         this.env.tabPanelOnOff = false;

         }).
         catch(error => {
         console.log(error);
         this.messageService.add({severity:'error', summary: 'Erro', detail:error.error[0].mensagemUsuario});
      });
   }

}

