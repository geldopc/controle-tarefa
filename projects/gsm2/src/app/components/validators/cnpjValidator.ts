import { Validador } from '../../objects/interfaces/validador';

export class CnpjValidator implements Validador {

    private static cnpjInvalido: String = "Cnpj inválido";
    private static invalidos: String[] = ["00000000000000", "11111111111111", "22222222222222", "33333333333333", "44444444444444", "55555555555555", "66666666666666", "77777777777777", "88888888888888", "99999999999999"];

    public validar(cnpj: any): String {
        return this.validarCnpj(cnpj);
    }

    private validarCnpj(cnpj: String): String {

        if (!cnpj || cnpj.length != 14 || !this.basicValidation(cnpj)) {
            return CnpjValidator.cnpjInvalido;
        }

        // Valida DVs
        var tamanho: number = 12;
        var numeros: String = cnpj.substring(0, tamanho);
        var digitos: String = cnpj.substring(tamanho);

        var dv1: number = 0;
        var pos: number = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            dv1 += +numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        var resultado = dv1 % 11 < 2 ? 0 : 11 - dv1 % 11;
        if (resultado != +digitos.charAt(0)) {
            return CnpjValidator.cnpjInvalido;
        }

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        var dv2: number = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            dv2 += +numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = dv2 % 11 < 2 ? 0 : 11 - dv2 % 11;
        if (resultado != +digitos.charAt(1)) {
            return CnpjValidator.cnpjInvalido;;
        }

        return null
    }

    private basicValidation(cnpj: String): boolean {
        return !CnpjValidator.invalidos.some(input => input === cnpj);
    }
}