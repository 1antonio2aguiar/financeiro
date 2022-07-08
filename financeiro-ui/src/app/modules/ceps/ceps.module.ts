import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { IMaskModule } from 'angular-imask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';

import { CepsRoutingModule } from './ceps-routing.module';
import { CepsPesquisaComponent } from './ceps-pesquisa/ceps-pesquisa.component';
import { CepsCadastroComponent } from './ceps-cadastro/ceps-cadastro.component';

@NgModule({
   declarations: [CepsPesquisaComponent, CepsCadastroComponent],
   imports: [
      CommonModule,
      SharedModule,
      IMaskModule,
      CalendarModule,
      CardModule,
      InputTextModule,
      KeyFilterModule,
      TableModule,
      PanelModule,
      MessagesModule,
      MessageModule,
      ToastModule,
      DropdownModule,
      CepsRoutingModule
   ],
   providers: [DialogService]
})

export class CepsModule { }

