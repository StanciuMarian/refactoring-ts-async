import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError, OperatorFunction } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import { Toastr } from './toastr.service';


@Injectable()
export class HttpRequestsInterceptor implements HttpInterceptor {

    constructor(private toastr: Toastr) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            //this.catchError() - sau asa ???
            catchError((error: HttpErrorResponse) => {
                this.toastr.error(error.error.messagekey, error.error.userMessage); //ce punem ca eroare ???
                return throwError(error);
            })
        );
    }


    // catchError(): OperatorFunction<HttpEvent<any>,any> {
    //     return catchError((error: HttpErrorResponse) => {
    //         console.log('aici')
    //         this.toastr.error("gsagasg", "gsagsag");
    //         return throwError(error);
    //     })
    // }
}
