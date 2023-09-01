import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { AuthData } from './auth-data.model';
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
    private isAuthenticated = false;
    private token: any; ////
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken(){
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(name: string, email: string, password: string) {
        const authData: AuthData = {name: name, email: email, password: password};
        this.http.post("http://localhost:3000/register", authData)
            .subscribe(response => {
                console.log(response);
            });
    }

    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        this.http.post<{token: string, expiresIn: number }>("http://localhost:3000/login", authData)
            .subscribe(response => {
                console.log(response);
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate); // Local Storage
                    this.router.navigate(['/profile']); // Muda de página após logar
                }
            });
    }

    
    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expireIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expireIn > 0) {
            this.token = authInformation?.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expireIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']); // Muda de página após deslogar
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000); // Multiplica por 1000 pois é em milissegundos
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

    ////////////////////////////////////////////

    getUserProfile() {
        console.log("Fetching user profile...");
        return this.http.get<{ name: string, balance: number }>("http://localhost:3000/profile");
    }

    
    depositBalance(amount: number): Observable<any> {
        const depositData = { amount: amount };
        return this.http.post('http://localhost:3000/deposit', depositData);
      }
    
    withdrawBalance(amount: number) {
        const data = { amount: amount };
        return this.http.post<any>('http://localhost:3000/withdraw', data);
    }
    
    

}