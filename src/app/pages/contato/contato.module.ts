import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { SmAlertController } from 'projects/gsm2/src/app/components/sm-alert-controller/sm-alert-controller.component';
import { ContatoProvider } from 'projects/gsm2/src/app/providers/ContatoProvider';
import { ContatoService } from 'projects/gsm2/src/app/services/ContatoService';
import { AppRoutingModule } from '../../app.routing.module';
import { ComponentesModule } from '../../components/components.module';
import { ContatoComponent } from './contato.component';

@NgModule({
  declarations: [
    ContatoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentesModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RecaptchaFormsModule,
    RecaptchaModule.forRoot(),
  ],
  exports: [
    ContatoComponent
  ],
  providers: [
    SmAlertController,
    ContatoService,
    ContatoProvider
  ]
})
export class ContatoModule { }
