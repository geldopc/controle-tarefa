import { Validador } from '../../objects/interfaces/validador';

export class CpfValidator implements Validador {

    private static cpfInvalido: String = "Cpf inválido";
    private static invalidos: String[] = ["00000000000", "11111111111", "22222222222", "33333333333", "44444444444", "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];

    public validar(cpf: any): String {
        return this.validarCpf(cpf);
    }

    private validarCpf(cpf: String): String {

        if (!cpf || cpf.length != 11 || !this.basicValidation(cpf)) {
            return CpfValidator.cpfInvalido;
        }
        // Valida 1o digito 
        var add: number = 0;
        for (let i = 0; i < 9; i++) {
            add += parseInt(cpf.charAt(i)) * (10 - i);
        }
        var dv1 = 11 - (add % 11);
        if (dv1 == 10 || dv1 == 11) {
            dv1 = 0;
        }
        if (dv1 != parseInt(cpf.charAt(9))) {
            return CpfValidator.cpfInvalido;
        }

        // Valida 2o digito 
        add = 0;
        for (let i = 0; i < 10; i++) {
            add += parseInt(cpf.charAt(i)) * (11 - i);
        }
        var dv2 = 11 - (add % 11);
        if (dv2 == 10 || dv2 == 11) {
            dv2 = 0;
        }
        if (dv2 != parseInt(cpf.charAt(10))) {
            return CpfValidator.cpfInvalido;
        }

        return null;
    }

    private basicValidation(cpf: String): boolean {
        return !CpfValidator.invalidos.some(input => input === cpf);
    }

}