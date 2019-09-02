import { IEntidade, IPersistencia } from './IPersistencia';
import { PersistenciaStorage } from './PersistenciaStorage';

export abstract class PersistenciaGenerica<T extends IEntidade, P extends IPersistencia<T>> implements IPersistencia<T> {

    protected persistencia: P = null;

    constructor() {
        this.conectar();
    }

    abstract criarPersistencia(tipo: string): P;

    criar(): Promise<any> {
        return this.persistencia.criar();
    }

    destruir(): Promise<any> {
        return this.persistencia.destruir();
    }

    conectar(): Promise<any> {
        return this.conectarSQLite();
    }

    private conectarSQLite(): Promise<IPersistencia<T>> {
        return new Promise<IPersistencia<T>>((resolve, reject) => {
            this.persistencia = this.criarPersistencia('sqlite');
            resolve();
        });
    }

    inserir(objeto: T): Promise<any> {
        return this.persistencia.inserir(objeto);
    }

    inserirVarios(objetos: Array<T>): Promise<any> {
        return this.persistencia.inserirVarios(objetos);
    }

    atualizar(objeto: T): Promise<any> {
        return this.persistencia.atualizar(objeto);
    }

    remover(chave: any): Promise<any> {
        return this.persistencia.remover(chave);
    }
    removerTodos(): Promise<any> {
        return this.persistencia.removerTodos();
    }

    obter(chave: any): Promise<T> {
        return this.persistencia.obter(chave);
    }

    obterTodos(): Promise<Array<T>> {
        return this.persistencia.obterTodos();
    }

    fechar(): Promise<any> {
        return this.persistencia.fechar();
    }

    estaConectado(): Boolean {
        return this.persistencia === null ? false : this.persistencia.estaConectado();
    }

    public get tipo() {
        if (this.persistencia === null) {
            return '';
        } else if (this.persistencia instanceof PersistenciaStorage) {
            return 'STORAGE';
        }
        return 'DESCONHECIDO';
    }
}
