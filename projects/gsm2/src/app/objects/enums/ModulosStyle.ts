import { Enum, EnumImp } from "./enum"
export class ModulosStyle extends Enum{

    static DEFESA_ANIMAL = new ModulosStyle(new EnumImp("Defesa Animal", 'nav-defesaanimal'));
    static DEFESA_VEGETAL = new ModulosStyle(new EnumImp("Defesa Vegetal", 'nav-defesavegetal'));
    static INSPECAO = new ModulosStyle(new EnumImp("Inspeção", 'nav-inspecao'));
    static AGROTOXICO = new ModulosStyle(new EnumImp("Agrotóxico", 'nav-agrotoxico'));
    static PORTAL_CORPORATIVO = new ModulosStyle(new EnumImp("Portal Corporativo", "nav-portal-corporativo"));
    static PORTAL_SERVICOS = new ModulosStyle(new EnumImp("Portal Servicos", "nav-portal-servicos"));
    static GUIAS_USO = new ModulosStyle(new EnumImp("Guias de Uso", "nav-guias-uso"));

    static get values():ModulosStyle[]{
        return [this.DEFESA_ANIMAL, this.DEFESA_VEGETAL, this.INSPECAO, this.AGROTOXICO];
    }
    
}
