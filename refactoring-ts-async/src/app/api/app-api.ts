import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { constants } from "../common/helpers/constants";
import { HttpHeaders } from "@angular/common/http";
import { StoreDto } from "./dto/StoreDto";
import { CountryDto } from "./dto/CountryDto";
import { CityDto } from "./dto/CityDto";

/**
 * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
 * 
 * █████╗ ██╗   ██╗████████╗ ██████╗  ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗███████╗██████╗ 
 * ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
 * ███████║██║   ██║   ██║   ██║   ██║██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   █████╗  ██║  ██║
 * ██╔══██║██║   ██║   ██║   ██║   ██║██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██╔══╝  ██║  ██║
 * ██║  ██║╚██████╔╝   ██║   ╚██████╔╝╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ███████╗██████╔╝
 * ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝ 
 */
@Injectable({providedIn: 'root'})
export class AppApi {
    constructor(private http: HttpClient) {
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    getStoresByCity(cityId: number): Observable<StoreDto[]> {
        return this.http.get<StoreDto[]>(`${constants.APP_ENDPOINT}/cities/${cityId}/stores`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new StoreDto(), entry))))
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    getAllCountries(): Observable<CountryDto[]> {
        return this.http.get<CountryDto[]>(`${constants.APP_ENDPOINT}/countries`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new CountryDto(), entry))))
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    getCitiesByCountry(countryId: number): Observable<CityDto[]> {
        return this.http.get<CityDto[]>(`${constants.APP_ENDPOINT}/countries/${countryId}/cities`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new CityDto(), entry))))
    }
}
