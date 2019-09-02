import { Enum, EnumImp } from "./enum";
export class TipoTimeout extends Enum {

    static DEFAULT = new TipoTimeout(new EnumImp("Default", 60000));
    static SINC = new TipoTimeout(new EnumImp("SINC", 100000));
    static BACKGROUND = new TipoTimeout(new EnumImp("BACKGROUND", 160000));
    static DISTRIBUICAO = new TipoTimeout(new EnumImp("DISTRIBUICAO", 3000000));

    static get values(): TipoTimeout[] {
        return [this.DEFAULT];
    }

}
