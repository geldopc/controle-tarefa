import swal from "sweetalert2";
import * as $ from 'jquery';
export class SmAlertController {
  constructor() {}

  info(titulo: string, mensagem: string): Promise<any> {
    return this.mensagem(titulo, mensagem, "info");
  }
  sucesso(titulo: string, mensagem: string): Promise<any> {
    return this.mensagem(titulo, mensagem, "success");
  }
  error(titulo: string, mensagem: string): Promise<any> {
    return this.mensagem(titulo, mensagem, "error");
  }
  warning(titulo: string, mensagem: string): Promise<any> {
    return this.mensagem(titulo, mensagem, "warning");
  }

  private mensagem(titulo: string, mensagem: string, tipo: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      swal({
        title: titulo,
        text: mensagem,
        type: tipo,
        showCancelButton: false
      });
       //remove o fundo cinza do alert 
       $('body').removeClass("swal2-height-auto")
    });
  }

  confirmacao(
    titulo: string,
    mensagem: string,
    textoConfirmacao: string,
    tipo: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      swal({
        title: titulo,
        text: mensagem,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: textoConfirmacao,
        cancelButtonText: "Nada a ser feito"
      }).then(result => {
        if (result.value) {
          swal("Deleted!", "Your imaginary file has been deleted.", "success");
          // https://sweetalert2.github.io/#handling-dismissals
        } // else if (result.dismiss === swal.DismissReason.cancel) {
        //   swal(
        //     'Cancelled',
        //     'Your imaginary file is safe :)',
        //     'error'
        //   )
        // }
      });
    });
  }
}
