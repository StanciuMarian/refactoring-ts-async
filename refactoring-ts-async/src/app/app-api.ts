import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppApi {
    
    constructor(private httpClient: HttpClient) {}
    
    getCities(): Observable<any> {
        return this.httpClient.get('http://localhost:8080/api/cities');
    }

    getSubsidiaries(cityCode: string): any {
        return this.httpClient.get(`http://localhost:8080/api/subisidiariesByCityCode?cityCode=${cityCode}`)
    }
}