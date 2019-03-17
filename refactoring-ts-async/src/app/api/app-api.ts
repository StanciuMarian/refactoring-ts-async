import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { constants } from "../common/helpers/constants";
import { HttpHeaders } from "@angular/common/http";
import { CityDto } from "./dto/CityDto";
import { OperationDto } from "./dto/OperationDto";
import { SubsidiaryDto } from "./dto/SubsidiaryDto";

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
    getCities(): Observable<CityDto[]> {
        return this.http.get<CityDto[]>(`${constants.APP_ENDPOINT}/cities`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new CityDto(), entry))))
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    getOperations(): Observable<OperationDto[]> {
        return this.http.get<OperationDto[]>(`${constants.APP_ENDPOINT}/operation`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new OperationDto(), entry))))
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    getSubsidiariesByCityCode(cityCode: string): Observable<SubsidiaryDto[]> {
        return this.http.get<SubsidiaryDto[]>(`${constants.APP_ENDPOINT}/subisidiariesByCityCode?cityCode=${cityCode}`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new SubsidiaryDto(), entry))))
    }

    /**
     * DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED
     * 
     */
    getSubsidiariesByOperationCode(operationCode: string): Observable<SubsidiaryDto[]> {
        return this.http.get<SubsidiaryDto[]>(`${constants.APP_ENDPOINT}/subisidiariesByOperationCode?operationCode=${operationCode}`,{})
        	.pipe(map(response => response.map(entry => Object.assign(new SubsidiaryDto(), entry))))
    }
}
