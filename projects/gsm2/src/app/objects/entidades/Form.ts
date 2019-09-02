export class Form {
    public validadores: any[];

    constructor() {
        this.validadores = [];
    }

    public validar() {
        if (this.validadores.some(val => !val.isValid())) {
            return false;
        }
        return true;
    }
}
