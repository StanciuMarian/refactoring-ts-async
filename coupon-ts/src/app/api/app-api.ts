import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { constants } from "../common/helpers/constants";
import { HttpHeaders } from "@angular/common/http";
import { StoreDto } from "./dto/StoreDto";
import { CountryDto } from "./dto/CountryDto";
import { CityDto } from "./dto/CityDto";
import { CouponForm } from "./dto/CouponForm";

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
    getCitiesByCountry(countryIso: string): Observable<CityDto[]> {
        return this.http.get<CityDto[]>(`${constants.APP_ENDPOINT}/countries/${countryIso}/cities`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new CityDto(), entry))))
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    requestCoupon(form: CouponForm): Observable<string> {
        return this.http.post(`${constants.APP_ENDPOINT}/coupon`,form,{responseType: 'text'})
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    validateReceiptId(receiptId: string, storeId: number): Observable<void> {
        return this.http.get<void>(`${constants.APP_ENDPOINT}/validateReceiptId?receiptId=${receiptId}&storeId=${storeId}`,{})
    }
}
