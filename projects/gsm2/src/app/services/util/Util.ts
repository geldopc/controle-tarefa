import { DatePipe } from '@angular/common';
import { conformToMask } from 'angular2-text-mask';
import { Injectable } from "@angular/core";
import { Masks } from '../../components/validators/masks';
import { LoadingController, Loading } from 'ionic-angular';
import * as $ from 'jquery';

@Injectable()
export class Util {

    private mask: Masks;
    private load: Loading;

    constructor(private loadingCtrl: LoadingController) {

    }

    carregando(status: Boolean) {
        if (status) {
            this.load = this.loadingCtrl.create({
                content: 'Carregando aguarde...'
            });
            this.load.present().then(() => {
                return;
            });
        } else {
            this.load.dismiss();
        }
    }

    getFormattedCpfCnpj(cpfCnpj: string) {
        if (cpfCnpj.length === 11) {
            this.mask = new Masks('cpf');
        } else if (cpfCnpj.length === 14) {
            this.mask = new Masks('cnpj');
        }

        if (this.mask != null) {
            return conformToMask(cpfCnpj, this.mask.mask, { guide: false }).conformedValue;
        } else {
            return cpfCnpj;
        }
    }

    getDispositivo() {
        return null;
    }
    /**
     * Remove todos os acentos da string
     * @param str
     */
    removerAcentuacao(str) {
        const com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
        const sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
        let novastr = "";
        for (let i = 0; i < str.length; i++) {
            let troca = false;
            for (let a = 0; a < com_acento.length; a++) {
                if (str.substr(i, 1) === com_acento.substr(a, 1)) {
                    novastr += sem_acento.substr(a, 1);
                    troca = true;
                    break;
                }
            }
            if (troca === false) {
                novastr += str.substr(i, 1);
            }
        }
        return novastr;
    }

    /**
    * Aplica ponto decimal a medida que o usuário digita os valores numéricos
    * O input deve implementar evento que dispara a chamada do método a cada letra digitada
    * @param qtdDecimal
    * @param value
    VERSAO ANTIGA
    */
    maskDecimal(qtdDecimal, value) {
        value = value.replace('.', '');
        if (value.length > qtdDecimal) {
            return value.substr(0, value.length - qtdDecimal) + "." + value.substr(value.length - qtdDecimal, value.length);
        }
        return value;
    } *

        maskCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', symbol: 'R$' });
    }

    maskDecimalTest(value) {
        return value.toLocaleString();
    }

    /**
     * Formata a data - pt-BR
     * Exemplo formado: 'dd/MM/yyyy'
     * @param data
     * @param patterns
     *
     */
    formatarData(data: string, patterns: string): string {
        return new DatePipe('pt-BR').transform(data, patterns);
    }

    /**
    * Formata a data - en-US
    * Exemplo formado: 'yyyy-MM-dd'
    * @param data
    * @param patterns
    *
    */
    formatarDataUS(data: string, patterns: string): string {
        return new DatePipe('en-US').transform(data, patterns);
    }



    mesAtual(): string {
        const mesesAno: string[] = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return mesesAno[new Date().getMonth()];
    }

    get cores(): Array<string> {
        const cores: Array<string> = [
            "#d43a40", "#63b598", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177", "#0d5ac1" ,
            "#d86464", "#a387f5", "#14a9ad", "#4ca2f9", "#a4e43f", "#d298e2", "#6119d0",
            "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e", "#61da5e", "#cd2f00" ,
            "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573", "#4bb473", "#75d89e" ,
            "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b", "#ca4751", "#7e50a8" ,
            "#c4d647", "#e0eeb8", "#11dec1", "#289812", "#566ca0", "#ffdbe1", "#605d67" ,
            "#935b6d", "#916988", "#513d98", "#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
            "#2f2444", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#68d06d",
            "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
            "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
            '#FF9F40',
            '#FFCD56',
            '#4BC0C0',
            '#36A2EB',
            '#372261',
            '#505050',
            '#92001f',
            '#ff8a65',
            '#e57373',
            '#f06292',
            '#ba68c8',
            '#9575cd',
            '#7986cb',
            '#64b5f6',
            '#4dd0e1',
            '#4db6ac',
            '#ffd54f',
            '#cc65fe',
            '#ffce56',
            '#1de9b6',
            '#ff5252',
            '#2962ff',
            '#29b6f6',
            '#26c6da',
            '#66bb6a',
            '#9ccc65',
            '#d4e157',
            '#ffca28',
            '#ffa726',
            '#ff7043',
            '#270c0c',
            '#a5d6a7',
            '#2b0831',
            '#536dfe',
            '#40c4ff',
            '#64ffda',
            '#69f0ae',
            '#eeff41',
            '#ffd740',
            '#ff6e40',
            '#eeeeee',
            '#8e24aa',
            '#7c4dff',
            '#448aff',
            '#18ffff',
            '#9e9e9e',
            '#006064',
            '#263238',
            '#009688',
            '#c5cae9'
        ];
        return cores;
    }


    /**
     *
     * @param dec Aplica máscara decimal no input.
     * OBS: O type do campo deve estar como "text".
     * @param value
     */
    decimalFormat(value, dec?: number) {
        let val = String(value);
        /*
        let neg
        if (fl_neg === 'negativo') {
            neg = val.indexOf('-');
        }
        */
        val = this.removerCaracteres(val, "0123456789");
        if (val.length > 0) {
            while (val.charAt(0) === '0' && val.length > 1) {
                val = val.substring(1);
            }
        }
        let tam = val.length;
        let aux = "";
        if (tam <= dec) {
            for (let i = tam - 1; i < dec; i++) {
                val = "0" + val;
                tam = val.length;
            }
            value = val;
        }
        if ((tam > dec) && (tam <= dec + 3)) {
            if (dec === 0) {
                value = val.substr(0, tam - dec);
            } else {
                value = val.substr(0, tam - dec) + ','
                    + val.substr(tam - dec, tam);
            }
        }
        if ((tam >= dec + 4) && (tam <= dec + 6)) {
            if (dec === 0) {
                value = val.substr(0, tam - (dec + 3)) + '.'
                    + val.substr(tam - (dec + 3), 3);
            } else {
                value = val.substr(0, tam - (dec + 3)) + '.'
                    + val.substr(tam - (dec + 3), 3) + ','
                    + val.substr(tam - dec, tam);
            }
        }
        if ((tam >= dec + 7) && (tam <= dec + 9)) {
            if (dec === 0) {
                value = val.substr(0, tam - (dec + 6)) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + val.substr(tam - (dec + 3), 3);
            } else {
                value = val.substr(0, tam - (dec + 6)) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + val.substr(tam - (dec + 3), 3) + ','
                    + val.substr(tam - dec, tam);
            }
        }
        if ((tam >= dec + 10) && (tam <= dec + 12)) {
            if (dec === 0) {
                value = val.substr(0, tam - (dec + 9)) + '.'
                    + val.substr(tam - (dec + 9), 3) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + + val.substr(tam - (dec + 3), 3);
            } else {
                value = val.substr(0, tam - (dec + 9)) + '.'
                    + val.substr(tam - (dec + 9), 3) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + val.substr(tam - (dec + 3), 3) + ','
                    + val.substr(tam - dec, tam);
            }
        }
        if ((tam >= dec + 13) && (tam <= dec + 15)) {
            if (dec === 0) {
                value = val.substr(0, tam - (dec + 12)) + '.'
                    + val.substr(tam - (dec + 12), 3) + '.'
                    + val.substr(tam - (dec + 9), 3) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + val.substr(tam - (dec + 3), 3);
            } else {
                value = val.substr(0, tam - (dec + 12)) + '.'
                    + val.substr(tam - (dec + 12), 3) + '.'
                    + val.substr(tam - (dec + 9), 3) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + val.substr(tam - (dec + 3), 3) + ','
                    + val.substr(tam - dec, tam);
            }
        }
        if ((tam >= dec + 16) && (tam <= dec + 18)) {
            if (dec === 0) {
                value = val.substr(0, tam - (dec + 15)) + '.'
                    + val.substr(tam - (dec + 15), 3) + '.'
                    + val.substr(tam - (dec + 12), 3) + '.'
                    + val.substr(tam - (dec + 9), 3) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + val.substr(tam - (dec + 3), 3);
            } else {
                value = val.substr(0, tam - (dec + 15)) + '.'
                    + val.substr(tam - (dec + 15), 3) + '.'
                    + val.substr(tam - (dec + 12), 3) + '.'
                    + val.substr(tam - (dec + 9), 3) + '.'
                    + val.substr(tam - (dec + 6), 3) + '.'
                    + val.substr(tam - (dec + 3), 3) + ','
                    + val.substr(tam - dec, tam);
            }
        }
        aux = "0,";
        if (dec === 0) {
            aux = "0";
        }
        for (let i = 0; i < dec; i++) {
            aux = aux + "0";
        }
        return value;
    }

    // retira caracteres invalidos da string
    removerCaracteres(valor, validos) {
        var result = "";
        var aux;
        for (var i = 0; i < valor.length; i++) {
            const val = valor.substring(i, i + 1);
            aux = validos.indexOf(val);
            if (aux >= 0) {
                result += val;
            }
        }
        return result;
    }

    /**
   * compara se a data inicial é menor ou maior que a data final
   * @param dataInicial dd/mm/yyyy
   * @param dataFinal dd/mm/yyyy
   */
    compararData(dataInicial: string, dataFinal: string): boolean {
        const inicio = dataInicial.split("/");
        const fim = dataFinal.split("/");

        // tslint:disable-next-line:radix
        const resultInicio = new Date(parseInt(inicio[2]), parseInt(inicio[1]) - 1, parseInt(inicio[0]));
        // tslint:disable-next-line:radix
        const resultFim = new Date(parseInt(fim[2]), parseInt(fim[1]) - 1, parseInt(fim[0]));

        if (resultInicio < resultFim) {
            return true;
        }
        return false;

    }

    primerioDiaMes(): string {
        const date = new Date();
        const ano = date.getFullYear();
        const mes = date.getMonth() + 1;
        const dia = new Date(ano, mes, 1).getDate();
        return ano + '-' + mes + '-' + dia;
    }

    ultimoDiaMes(): string {
        const date = new Date();
        const ano = date.getFullYear();
        const mes = date.getMonth() + 1;
        const dia = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return ano + '-' + mes + '-' + dia;
    }

    formatarValoresMonetarios(nr: number) {
        const numero = Number(nr).toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    soNumero(value) {
        const val = value.replace(/[^0-9]+/g, '');
        return val;
    }

    soLetra(value) {
        const val = value.replace(/\D+/g, '');
        return val;
    }

    maskMoney(nr: number, pre?: boolean) {
        const nrStr = String(nr).replace(',', '.');
        const numeros = Number(nrStr).toFixed(2).split('.');
        if (numeros && numeros[0] !== "NaN") {
            numeros[0] = pre ? "R$ " + numeros[0].split(/(?=(?:...)*$)/).join('.') : numeros[0].split(/(?=(?:...)*$)/).join('.');
        } else {
            numeros.push('0');
        }
        return numeros.join(',');
    }

    getEstados(): Array<{ descricao: string, sigla: string }> {
        const estados: Array<{ descricao: string, sigla: string }> = [
            { descricao: '-- selecione --', sigla: null },
            { descricao: 'Acre', sigla: 'AC' },
            { descricao: 'Alagoas', sigla: 'AL' },
            { descricao: 'Amapá', sigla: 'AP' },
            { descricao: 'Amazonas', sigla: 'AM' },
            { descricao: 'Bahia', sigla: 'BA' },
            { descricao: 'Ceará', sigla: 'CE' },
            { descricao: 'Distrito Federal', sigla: 'DF' },
            { descricao: 'Espírito Santo', sigla: 'ES' },
            { descricao: 'Goiás', sigla: 'GO' },
            { descricao: 'Maranhão', sigla: 'MA' },
            { descricao: 'Mato Grosso', sigla: 'MT' },
            { descricao: 'Mato Grosso do Sul', sigla: 'MS' },
            { descricao: 'Minas Gerais', sigla: 'MG' },
            { descricao: 'Pará', sigla: 'PA' },
            { descricao: 'Paraíba', sigla: 'PB' },
            { descricao: 'Paraná', sigla: 'PR' },
            { descricao: 'Pernambuco', sigla: 'PE' },
            { descricao: 'Piauí', sigla: 'PI' },
            { descricao: 'Rio de Janeiro', sigla: 'RJ' },
            { descricao: 'Rio Grande do Norte', sigla: 'RN' },
            { descricao: 'Rio Grande do Sul', sigla: 'RS' },
            { descricao: 'Rondônia', sigla: 'RO' },
            { descricao: 'Roraima', sigla: 'RR' },
            { descricao: 'Santa Catarina', sigla: 'SC' },
            { descricao: 'São Paulo', sigla: 'SP' },
            { descricao: 'Sergipe', sigla: 'SE' },
            { descricao: 'Tocantins', sigla: 'TO' }
        ];
        return estados;
    }

    closeModal(id) {
        $("#" + id).hide();
        $('.modal-backdrop').remove();
        $('#body').removeClass('modal-open');
    }

    /**
     * Converte uma data do tipo string para o tipo Date.
     * Passar Como Parâmetro a Data no Formato yyyy-MM-dd ou dd/MM/yyyy
     * @param data
     * @returns Date
     */
    stringToDate(data: string): Date {
        // console.debug('stringToDate...entrada', data);
        if (data) {
            let parts;
            let objDate = new Date();
            if (data.indexOf("-") > -1) {
                parts = data.split("-");
                if (parts[2] && parts[2].split(" ") && parts[2].split(" ").length > 0) {
                    parts[2] = parts[2].split(" ")[0];
                }
                objDate = new Date(+parts[0], +parts[1] - 1, +parts[2])
            } else if (data.indexOf("/") > -1) {
                parts = data.split("/");
                if (parts[2] && parts[2].split(" ") && parts[2].split(" ").length > 0) {
                    parts[2] = parts[2].split(" ")[0];
                }
                objDate = new Date(+parts[2], +parts[1] - 1, +parts[0])
            }
            objDate.setHours(0, 0, 0, 0);
            // console.debug('stringToDate...saida', objDate);
            return objDate;
        } else {
            return null;
        }
    }
}
