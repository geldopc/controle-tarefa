import { Injectable } from '@angular/core';

@Injectable()
export class LoggerSQLite {


    criar(): Promise<any> {
        // return this.sqlite.executeSql(' CREATE TABLE IF NOT EXISTS tb_log (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario TEXT, log TEXT, uf TEXT) ', []);
        throw new Error("Method not implemented.");

    }

    destruir(): Promise<any> {
        // return this.sqlite.executeSql(' DROP TABLE tb_log ', []);
        throw new Error("Method not implemented.");

    }

    inserir(objeto: string): Promise<any> {
        // return this.sqlite.executeSql(' INSERT INTO tb_log (usuario, log, uf) VALUES (?,?,?) ',
        //     [GerenciadorSessao.usuario ? GerenciadorSessao.usuario.dsCpfCnpj : null, objeto, GerenciadorSessao.usuario ? GerenciadorSessao.usuario.dsUf : null]);
        throw new Error("Method not implemented.");

    }

    remover(chave: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    removerTodos(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    obter(chave: any): Promise<string> {
        throw new Error("Method not implemented.");
    }

    obterTodos(): Promise<string[]> {
        // return this.sqlite.executeSql(' SELECT log FROM tb_log where usuario = ? and uf = ? order by id ',
        //     [GerenciadorSessao.usuario.dsCpfCnpj, GerenciadorSessao.usuario.dsUf]).then(result => {
        //         let res = result.rows;
        //         let logs: string[] = [];
        //         for (let i = 0; i < res.length; i++) {
        //             logs.push(res.item(i).log);
        //         }
        //         return logs;
        //     });
        throw new Error("Method not implemented.");

    }

    atualizar(objeto: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
