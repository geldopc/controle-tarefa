import { Injectable } from "@angular/core";

@Injectable()
export class Logger {

    private classe: string;
    private loggerLevel: number;

    constructor(classe: string) {
        this.classe = classe;
    }

    private log(tipo: string, metodo: string, msg: string, parametros?: any) {
        let log;
        log = "[" + tipo + "]:" + new Date().toLocaleString() + ":" + this.classe + ":" + metodo + ":" + msg;

        if (tipo === 'DEBUG') {
            console.log(log);
            if (parametros) {
                console.log(parametros);
            }
        } else if (tipo === 'ERROR') {
            if (parametros) {
                log = log + ":" + parametros;
            }
            console.error(log);
        } else {
            console.log(log);
            if (parametros) {
                console.log(parametros);
            }
        }
    }

    public debug(metodo: string, msg: string, parametros?: any) {
        if (this.loggerLevel === 1) {
            this.log('DEBUG', metodo, msg, parametros);
        }
    }

    public info(metodo: string, msg: string, parametros?: any) {
        if (this.loggerLevel === 1) {
            this.log('INFO', metodo, msg, parametros);
        }
    }

    public error(metodo: string, msg: string, parametros?: string) {
        this.log('ERROR', metodo, msg, parametros);
    }

}
