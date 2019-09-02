import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { OcorrenciaGsm } from '../../objects/entidades/OcorrenciaGsm';
import { Tuple } from '../../objects/entidades/Tuple';

@Component({
    selector: 'app-dashboard-tarefa',
    templateUrl: './dashboard-tarefa.component.html',
    styleUrls: ['./dashboard-tarefa.component.scss']
})
export class DashboardTarefaComponent implements OnInit{

    @Input() ocorrencias: OcorrenciaGsm[];
    @Input() listStatus: Tuple[];
    @Input() listCliente: Tuple[];
    @Input() listProduto: Tuple[];
    @Input() listFuncionalidade: Tuple[];
    //Gráfico
    barChartOptions: any = {
        scaleShowVerticalLines: false,
        plugins: {
            labels: {
                render: function (args) {
                    return args.value;
                }
            }
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.labels[tooltipItem.index];
                    let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return label + ': ' + datasetLabel;
                },
                overlap: false,
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    callback: function (value, index, values) {
                        return value;
                    }
                }
            }]
        },
    };

    labelsStatus = [];
    dataStatus = [{
        backgroundColor: "#1b1b1b",
        borderColor: "#1b1b1b",
        borderWidth: 0,
        hoverBackgroundColor: "#424242",
        hoverBorderColor: "#424242",
        data: [],
        label: 'Status'
    }];
    labelsEstado = [];
    dataEstado = [{
        backgroundColor: "#1b1b1b",
        borderColor: "#1b1b1b",
        borderWidth: 0,
        hoverBackgroundColor: "#424242",
        hoverBorderColor: "#424242",
        data: [],
        label: 'Estado'
    }];
    labelsProduto = [];
    dataProduto = [{
        backgroundColor: "#1b1b1b",
        borderColor: "#1b1b1b",
        borderWidth: 0,
        hoverBackgroundColor: "#424242",
        hoverBorderColor: "#424242",
        data: [],
        label: 'Produto'
    }];
    labelsFuncionalidade = [];
    dataFuncionalidade = [{
        backgroundColor: "#1b1b1b",
        borderColor: "#1b1b1b",
        borderWidth: 0,
        hoverBackgroundColor: "#424242",
        hoverBorderColor: "#424242",
        data: [],
        label: 'Funcionalidade'
    }];

    constructor(

    ) { }

    ngOnInit(): void {
        // console.log('ngOnInit...', this);
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('ngOnChanges...', this);
        this.chartStatus();
        this.chartEstado();
        this.chartProduto();
        this.chartFuncionalidade();
    }

    chartStatus() {
        // console.log('chartStatus...', this);
        this.labelsStatus = [];
        let list = [];
        this.listStatus.forEach(item => {
            this.labelsStatus.push(item.select);
            this.dataStatus[0].data.push(0);
            list.push(this.ocorrencias.filter(o => o.inStatus === item.select).length);
        });
        setTimeout(() => {
            let clone = JSON.parse(JSON.stringify(this.dataStatus));
            clone[0].data = list;
            this.dataStatus = clone;
        }, 500);
    }

    chartEstado() {
        // console.log('chartStatus...', this);
        this.labelsEstado = [];
        let list = [];
        this.listCliente.forEach(item => {
            this.labelsEstado.push(this.ocorrencias.find(o => o.cdCliente === item.select)['dsSigla']);
            this.dataEstado[0].data.push(0);
            list.push(this.ocorrencias.filter(o => o.cdCliente === item.select).length);
        });
        setTimeout(() => {
            let clone = JSON.parse(JSON.stringify(this.dataEstado));
            clone[0].data = list;
            this.dataEstado = clone;
        }, 500);
    }

    chartProduto() {
        // console.log('chartStatus...', this);
        this.labelsProduto = [];
        let list = [];
        this.listProduto.forEach(item => {
            this.labelsProduto.push(item.show);
            this.dataProduto[0].data.push(0);
            list.push(this.ocorrencias.filter(o => o.cdProduto === item.select).length);
        });
        setTimeout(() => {
            let clone = JSON.parse(JSON.stringify(this.dataProduto));
            clone[0].data = list;
            this.dataProduto = clone;
        }, 500);
    }

    chartFuncionalidade() {
        // console.log('chartStatus...', this);
        this.labelsFuncionalidade = [];
        let list = [];
        this.listFuncionalidade.forEach(item => {
            this.labelsFuncionalidade.push(item.show);
            this.dataFuncionalidade[0].data.push(0);
            list.push(this.ocorrencias.filter(o => o.cdFuncionalidade === item.select).length);
        });
        setTimeout(() => {
            let clone = JSON.parse(JSON.stringify(this.dataFuncionalidade));
            clone[0].data = list;
            this.dataFuncionalidade = clone;
        }, 500);
    }
}
