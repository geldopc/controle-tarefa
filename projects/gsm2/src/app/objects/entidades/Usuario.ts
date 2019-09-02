import { Perfil } from "./Perfil";
import { Estado } from "./Estado";
import { Tuple } from "./Tuple";
import { Parametros } from "./Parametros";
import { ParametrosPerfil } from "./ParametrosPerfil";

export class Usuario {
    parametros: Parametros; // parametros sistema
    parametrosPerfil: ParametrosPerfil; // parametros do perfil
    perfil = new Perfil();
    perfis: string[] = [];
    constructor(
        public idUsuario?: string,
        public nrDocumento?: string,
        public nome?: string,
        public senha?: Estado,
        public novaSenha?: string,
        public inAtivo?: boolean,
        public inSituacao?: boolean,
        public inMaster?: boolean,
        public dsEmail?: string,
        public dsTelefone?: Perfil,
        public dsChave?: Array<Perfil>,
        public dsUf?: number,
        public nrPerfil?: number,
        public cdTipoUsuario?: any,
        public cdCliente?: any,
        public listPerfil?: string,
        public funcionario?: boolean,
        public dispositivo?: string,
        public dsCpfCnpj?: string,
        public inVeterinarioResponsavel?: boolean,
        public inAgronomoResponsavel?: boolean,
        public inFocalPoint?: boolean,
        // public inFocalPointVegetal?: boolean,
        public inKeyUser?: boolean,
        // public inKeyUserVegetal?: boolean,
        public inGerenteProjeto?: boolean,
        public inFiscalContrato?: boolean,
    ) { }

    get chave() {
        return new Tuple(this.nrDocumento, this.dsUf);
    }
}
