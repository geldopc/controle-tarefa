import { Storage } from '@ionic/storage';

import { IPersistencia, IEntidade } from './IPersistencia';

export class PersistenciaStorage<T extends IEntidade> implements IPersistencia<T> {

    private _estaConectado: Boolean = false;
    constructor(protected storage: Storage, protected nome: string) { }

    criar(): Promise<any> {
        return this.getDb().then(estado => {
            if (estado === null) {
                return this.storage.set(this.nome, {});
            }
        });
    }

    destruir(): Promise<any> {
        return this.storage.remove(this.nome);
    }

    conectar(): Promise<any> {
        // console.log('Abrindo conexão com StorageLocal');
        return this.storage.ready().then(() => this._estaConectado = true);
    }

    inserir(objeto: T): Promise<any> {
        return this.getDb().then(db => {
            db[objeto.chave.toString()] = objeto;
            // console.log(db[objeto.chave.toString()]);
            return this.updateDb(db);
        });
    }

    inserirVarios(objetos: Array<T>): Promise<any> {
        // console.log(objetos);
        return this.getDb().then(db => {
            objetos.forEach(obj => {
                db[obj.chave.toString()] = obj;
            });
            return this.updateDb(db);
        });
    }

    atualizar(objeto: T): Promise<any> {
        //  inserir é um set
        return this.inserir(objeto);
    }

    remover(chave: any): Promise<any> {
        return new Promise((resolve, reject) => { resolve() });
    }

    removerTodos(): Promise<any> {
        return this.storage.clear();
    }

    obter(chave: any): Promise<T> {
        return this.getDb().then(db => db[chave] === undefined ? null : db[chave]);
    }

    //  TODO: ta errado!
    obterTodos(): Promise<T[]> {
        return this.getDb().then(db => {
            const todos = [];
            for (let k in db) {
                todos.push(db[k]);
            }
            return todos;
        });
    }

    fechar(): Promise<any> {
        return new Promise<any>(resolve => resolve());
    }

    estaConectado(): Boolean {
        return this._estaConectado;
    }

    protected updateDb(db): Promise<any> {
        return this.storage.set(this.nome, db);
    }

    protected removeItemDb(chave: string): Promise<any> {
        return this.storage.remove(chave);
    }


    protected getDb(): Promise<any> {
        return this.storage.get(this.nome);
    }
}
