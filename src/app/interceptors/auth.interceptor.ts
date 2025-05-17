// chatbot-admin/src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private loader: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    this.loader.show();

    return next.handle(authReq).pipe(
      finalize(() => this.loader.hide()),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return from(this.auth.tryRefresh()).pipe(
            switchMap(success => {
              if (success) {
                const newToken = localStorage.getItem('jwt');
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                return next.handle(retryReq);
              } else {
                return throwError(() => error);
              }
            })
          ) as Observable<HttpEvent<any>>;
        }
        return throwError(() => error) as Observable<HttpEvent<any>>;
      })
    );
  }
}
