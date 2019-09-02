export class StatusConexao {
    private tokenAccess:string;
    private tokenRefresh:string;
    private statusConexao:boolean;
    private mensagemValue:string;
    private fetchingData:boolean = true;

    setStatus(tokenAccess:string, tokenRefresh:string, mensagem:string, statusConexao:boolean){
        this.tokenAccess = tokenAccess;
        this.tokenRefresh = tokenRefresh;
        this.mensagemValue = mensagem;
        this.statusConexao = statusConexao;
        this.fetchingData = false;
    }

    get accessToken():string{
        return this.tokenAccess;
    }

    get refreshToken():string{
        return this.tokenRefresh;
    }

    get validConection():boolean{
        return this.statusConexao;
    }

    get mensagem():string{
        return this.mensagemValue;
    }

    fetch(){
        this.fetchingData = true;
    }

    isFetching():boolean{
        return this.fetchingData;
    }
}