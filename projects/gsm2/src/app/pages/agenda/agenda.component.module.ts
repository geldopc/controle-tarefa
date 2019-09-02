import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { IonicPageModule } from 'ionic-angular';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { WebCorporativoComponentModule } from '../../components/web-corporativo/web-corporativo.module';
import { AgendaComponent } from './agenda.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt-PT';
import { CustomDateFormatter } from '../../providers/components/CustomDateFormatterProvider';

registerLocaleData(localePt);

@NgModule({
    declarations: [
        AgendaComponent,
    ],
    imports: [
        RouterModule,
        BrowserAnimationsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        WebCorporativoComponentModule,
        Ng4LoadingSpinnerModule.forRoot(),
        IonicPageModule.forChild(AgendaComponent),
    ],
    exports: [
        AgendaComponent
    ],
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: CustomDateFormatter
        }
    ]
})
export class AgendaComponentModule { }
