import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenProvider } from './token/token';
import { fromPromise } from 'rxjs/Observable/fromPromise';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenProviders: TokenProvider){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return fromPromise(this.tokenProviders.GetToken()).pipe(switchMap(token => {
            const headersConfig = {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            };
            if(token){
                headersConfig['Authorization'] = `beader ${token}`;
            }
            const _req = req.clone({//can't manipulate the header so cloning it.
                setHeaders: headersConfig
            });
            return next.handle(_req);
        }));
    }
}