import { ConfiguracaoService } from './../../services/util/Config';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StatusConexao } from './statusConexao'
import { AlertController } from "ionic-angular";


@Injectable()
export class ChecarRede {

    private static SEM_CONEXAO: string = "Sem acesso a rede, verifique sua conexão com a internet ou entre em contato com o administrador do sistema";

    constructor(
        public http: Http,
        private alertCtrl: AlertController,
    ) { }

    getNetwork(): String {
        return null;
    }

    private showAlert(parametro: string) {
        const alert = this.alertCtrl.create({
            title: 'Informações<br/> <hr/>',
            subTitle: parametro,
            buttons: ['OK']
        });
        alert.present();
    }

    getStatusConexao(exigeAutenticacao: boolean, onComplete?: any): Promise<StatusConexao> {
        return new Promise<StatusConexao>((resolve, reject) => {
            let status = new StatusConexao();
            status.fetch();
            if (this.getNetwork() === "none") {
                status.setStatus(null, null, ChecarRede.SEM_CONEXAO, false);
                onComplete(status);
                this.showAlert(status.mensagem);
            } else {
                let headers = new Headers({'Content-Type': 'application/json;charset=UTF-8'});
                let options = new RequestOptions({ headers: headers });
                if (exigeAutenticacao) {
                    // this.autenticacaoPersistenciaProvider.conectar().then(() => {
                    //     this.autenticacaoPersistenciaProvider.obter(1).then((result) => {
                    //         if (result && result.accessToken) {
                    //             this.http.post(ConfiguracaoService.isAuthenticate, result.accessToken).subscribe(
                    //                 data => {
                    //                     if (data.json().codMsgResponse == "MS0001") {
                    //                         status.setStatus(data.json().accessToken, data.json().refreshToken, data.json().msgResponse, true);
                    //                         onComplete(status)
                    //                     } else {
                    //                         status.setStatus(null, null, data.json().msgResponse, true);
                    //                         onComplete(status)
                    //                     }
                    //                 },
                    //                 err => {
                    //                     status.setStatus(null, null, ChecarRede.SEM_CONEXAO, false);
                    //                     onComplete(status);
                    //                     this.showAlert(status.mensagem);
                    //                     reject();
                    //                 }
                    //             );
                    //         } else {
                    //             status.setStatus(null, null, "Favor efetuar o login", false);
                    //             onComplete(status);
                    //             this.showAlert(status.mensagem);
                    //             reject();
                    //         }
                    //     });
                    // });
                } else {
                    this.http.post(ConfiguracaoService.isAliveUrl,'',options).subscribe(
                        data => {
                            if (data.json() == "1") {
                                status.setStatus(null, null, data.json().msgResponse, true);
                                onComplete(status);
                            } else {
                                status.setStatus(null, null, ChecarRede.SEM_CONEXAO, false);
                                onComplete(status);
                                this.showAlert(status.mensagem);
                                reject();
                            }
                        },
                        err => {
                            status.setStatus(null, null, ChecarRede.SEM_CONEXAO, false);
                            onComplete(status);
                            this.showAlert(status.mensagem);
                            reject();
                        }
                    );
                }
            }
            resolve(status);
        });
    }

}
