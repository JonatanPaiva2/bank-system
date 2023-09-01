import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    //Método para interceptar e adicionar um token de autorização aos cabeçalhos das solicitações HTTP
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken(); //Recebe o token
        //Método de clonagem. Uma nova instância de solicitação é criada e o cabeçalho 'Authorization' é definido para incluir o token de autenticação no formato 'Bearer <token>'
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        });
        return next.handle(authRequest);
    }
}