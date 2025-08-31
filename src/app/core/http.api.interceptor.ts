
import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { environment } from '../../environments/environments';
import {ApiResponse} from '../models/api/api.interface';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class HttpApiUrlInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('/assets/i18n/')) {
      return next.handle(req);
    }
    const token = this.authService.getToken();
    const apiReq = req.clone({
        url: `${environment.apiUrl}${req.url}`,
        setHeaders: { 'Accept-Language': 'en', Authorization: `Bearer ${token}`}
    });
    return next.handle(apiReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error && typeof error.error === 'object') {
          const apiError = error.error as ApiResponse<any>;
          return throwError(() => apiError);
        }
        //TODO: save last session and go to error page
        return throwError(() => error);
      })
    );
  }
}
