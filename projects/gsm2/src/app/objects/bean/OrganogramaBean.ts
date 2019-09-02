import { GrupoGestor } from "../entidades/GrupoGestor";
import { FocalPoint } from "../entidades/FocalPoint";
import { KeyUser } from "../entidades/KeyUser";

export class OrganogramaBean {
    grupoGestor: GrupoGestor;
    listFocalPointAnimal: FocalPoint[] = [];
    listFocalPointVegetal: FocalPoint[] = [];
    listFocalPointOutros: FocalPoint[] = [];
    listKeyUserAnimal: KeyUser[] = [];
    listKeyUserVegetal: KeyUser[] = [];
    listKeyUserOutros: KeyUser[] = [];
}
