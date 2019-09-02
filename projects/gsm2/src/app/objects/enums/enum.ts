export class Enum {
    
    protected labelValue: string;
    protected valor: any;

    constructor(en:EnumImp) {
        this.labelValue = en.label;
        this.valor = en.value;
    }

    get label():string{
        return this.labelValue;
    }

    get value():any{
        return this.valor;
    }
}

export class EnumImp{
    label:string;
    value:any;

    constructor(lbl:string, val:any){
        this.label = lbl;
        this.value = val;
    }
}