import { Usuario } from "./Usuario";
import { Estado } from "./Estado";

export class Sessao {
  usuario: Usuario = null;
  usuarioSindicato: Usuario = null;
  usuarioCrea: Usuario = null;
  dataUltimoLogin: Date = null;
  estado: Estado = null;
  sync = true;
  emiteGta = true;
  usuarioAutenticado: Boolean = false;

  get chave() {
    return "1";
  }
}
