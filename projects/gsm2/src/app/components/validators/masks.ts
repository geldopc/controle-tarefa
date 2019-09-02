import { CpfValidator, CnpjValidator } from './validators'
import { Validador } from '../../objects/interfaces/validador';

export class Masks {

    mask: any;
    mask1: any;
    mask2: any;
    dynamicMask: boolean = false;
    maxLength: number;
    minLength: number;
    private validador: Validador;

    constructor(mascara: String) {
        if (mascara == "telefone") {
            /*['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]*/
            /* ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]*/
            this.mask1 = '(**) ****-****';
            this.mask2 = '(**) *****-****';
            this.dynamicMask = true;
            this.maxLength = 11;
            this.minLength = 10;
            this.mask = this.mask1;
        } else if (mascara == "cpf") {
            //Adicionar Validação de Digito verificador
            /*[/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];*/
            this.mask = '***.***.***-**';
            this.maxLength = 11;
            this.minLength = this.maxLength;
            this.validador = new CpfValidator();
        } else if (mascara == "cnpj") {
            //Adicionar Validação de Digito verificador
            /*[/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/] */
            this.mask = '**.***.***/****-**';
            this.maxLength = 14;
            this.minLength = this.maxLength;
            this.validador = new CnpjValidator();
        } else if (mascara == "cep") {
            /*[/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/] */
            this.mask = '*****-***';
            this.maxLength = 8;
            this.minLength = this.maxLength;
        }
    }

    public inserirMascara(valor: string): string {
        let valorFormatado = "";
        let i = 0;
        if (valor != null && valor != '') {
            for (let j = 0; i < valor.length; j++) {
                if (j > this.mask.length) {
                    if(this.ajustMask(j)) {
                        valorFormatado = "";
                        i = 0;
                        j = 0;
                    }
                }
                if (this.mask.charAt(j) == '*') {
                    valorFormatado = valorFormatado + valor.charAt(i);
                    i++;
                } else {
                    valorFormatado = valorFormatado + this.mask.charAt(j);
                }
            }
        }
        return valorFormatado;
    }

    public ajustMask(num: number): boolean {
        if (this.mask1 != null && this.mask2 != null) {
            if (num >= this.minLength) {
                this.mask = this.mask2;
                return true;
            } else {
                this.mask = this.mask1;
            }
        }
        return false;
    }

    public validar(objeto: any) {
        if (this.validador) {
            return this.validador.validar(objeto);
        } else {
            return null;
        }
    }

}