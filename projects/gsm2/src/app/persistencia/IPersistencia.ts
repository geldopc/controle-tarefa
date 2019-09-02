
export interface IPersistencia<T> {
    /**
     * cria persistencia
     */
    criar(): Promise<any>;
    /**
     * destrói a persistencia
     */
    destruir(): Promise<any>;
    /**
     * Se conecta ao banco
     */
    conectar(): Promise<any>;

    inserir(objeto: T): Promise<any>;

    inserirVarios(objeto: Array<T>): Promise<any>;

    atualizar(objeto: T): Promise<any>;

    remover(chave: any): Promise<any>;

    removerTodos(): Promise<any>;

    obter(chave: any): Promise<T>;

    obterTodos(): Promise<Array<T>>;

    fechar(): Promise<any>;

    estaConectado(): Boolean;
}

export interface IEntidade {
    chave: any;
}
