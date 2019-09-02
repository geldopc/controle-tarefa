import {Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit} from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, DAYS_OF_WEEK} from 'angular-calendar';
import { OcorrenciaGsmService } from '../../services/OcorrenciaGsmService';
import { GerenciadorSessao } from '../../services/util/GerenciadorSessao';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { Agenda } from '../../objects/entidades/Agenda';
import { Util } from '../../services/util/Util';
import { DistribuicaoOcorrenciaGsm } from '../../objects/entidades/DistribuicaoOcorrenciaGsm';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    green: {
        primary: '#1b5e20',
        secondary: '#4c8c4a'
    }
};

@Component({
    selector: "app-agenda",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./agenda.component.html",
    styleUrls: ["./agenda.component.scss"]
})
export class AgendaComponent implements OnInit{

    expandido: boolean = false;
    ocorrencia: OcorrenciaGsm;
    distribuicao: DistribuicaoOcorrenciaGsm;
    eventos: Agenda[];
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    locale: string = 'pt-PT';
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];
    //     {
    //         start: subDays(startOfDay(new Date()), 1),
    //         end: addDays(new Date(), 1),
    //         title: 'A 3 day event',
    //         color: colors.red,
    //         actions: this.actions,
    //         allDay: true,
    //         resizable: {
    //             beforeStart: true,
    //             afterEnd: true
    //         },
    //         draggable: true
    //     },
    //     {
    //         start: startOfDay(new Date()),
    //         title: 'An event with no end date',
    //         color: colors.yellow,
    //         actions: this.actions
    //     },
    //     {
    //         start: subDays(endOfMonth(new Date()), 3),
    //         end: addDays(endOfMonth(new Date()), 3),
    //         title: 'A long event that spans 2 months',
    //         color: colors.blue,
    //         allDay: true
    //     },
    //     {
    //         start: addHours(startOfDay(new Date()), 2),
    //         end: new Date(),
    //         title: 'Saber qual o mês...',
    //         color: colors.green,
    //         actions: this.actions,
    //         resizable: {
    //             beforeStart: true,
    //             afterEnd: true
    //         },
    //         draggable: true
    //     }
    // ];

    activeDayIsOpen: boolean = true;

    constructor(
        private ocorrenciaService: OcorrenciaGsmService,
        private util: Util,
    ) { }

    ngOnInit(): void {
        console.log('AgendaComponent/ngOnInit...', this);
        this.ocorrenciaService.obterAgendaDistribuicao(GerenciadorSessao.usuario.nrDocumento)
        .then(res => {
            if (res && res.length) {
                this.eventos = res;
                res.forEach(item => {
                    let c = {} as CalendarEvent;
                    c.id = item.cdOcorrenciaDistribuicao;
                    c.start = item.dtInicio;
                    c.end = item.dtFim;
                    c.title = item.descricao ? item.descricao : item.distribuicao.ocorrencia.dsOcorrencia;
                    c.color = colors.green;
                    c.actions = this.actions;
                    c.resizable = { beforeStart: true, afterEnd: true };
                    c.draggable = true;
                    this.events.push(c);
                    item.distribuicao.ocorrencia.dtSolicitacao = this.util.stringToDate(String(item.distribuicao.ocorrencia.dtSolicitacao));
                });
            }
        }).then(() => this.refresh.next());
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map(iEvent => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        console.log('handleEvent...', action, event, this);
        this.distribuicao = this.eventos.find(e => e.cdOcorrenciaDistribuicao === event.id).distribuicao;
        this.ocorrencia = this.distribuicao.ocorrencia;
        if (this.distribuicao && this.ocorrencia && (!this.ocorrencia.distribuicoes || !this.ocorrencia.distribuicoes.length)) {
            this.ocorrencia.distribuicoes = [];
            this.ocorrencia.distribuicoes.push(this.distribuicao);
        }
        // this.modal.open(this.modalContent, { size: 'lg' });
    }

    addEvent(): void {
        this.events = [
            ...this.events,
            {
                title: 'New event',
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: colors.red,
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true
                }
            }
        ];
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter(event => event !== eventToDelete);
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    fechar() {
        this.ocorrencia = null;
    }
}
