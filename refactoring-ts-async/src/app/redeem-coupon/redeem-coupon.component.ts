import { Component, ViewChild, ElementRef } from '@angular/core';
import { CountryDto } from '../api/dto/CountryDto';
import { CityDto } from '../api/dto/CityDto';
import { StoreDto } from '../api/dto/StoreDto';
import { UserDto } from '../api/dto/UserDto';
import { CouponForm } from '../api/dto/CouponForm';
import { AppApi } from '../api/app-api';
import { UserApi } from '../api/user-api';
import { forkJoin, observable, Observable, Subject } from 'rxjs';
import { Toastr } from '../services/toastr.service';
import { mergeMap, map } from 'rxjs/operators';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'redeem-coupon-form',
  templateUrl: './redeem-coupon.component.html'
})
export class RedeemCouponComponent {

  countries: CountryDto[] = [];
  cities: CityDto[] = [];
  stores: StoreDto[] = [];

  couponForm = new CouponForm();
  selectedCountryIso: string;
  selectedCityId: number;
  user : UserDto;

  couponCode: string; // TODO display in page.

  isConfirmationDialogDisplayed = false;

  constructor(private api: AppApi,
            private userApi: UserApi,
            private toastr: Toastr) {}

  async ngOnInit() {
    [this.user, this.countries] = await Promise.all([this.userApi.getCurrentUser().toPromise(),  this.api.getAllCountries().toPromise()]);
    this.selectedCountryIso = this.countries.find(c => c.id == this.user.countryId).iso;
    this.loadCitiesByCurrentCountry(); 
  } 
  


  loadCitiesByCurrentCountry() { 
    this.api.getCitiesByCountry(this.selectedCountryIso).pipe(map(e =>  this.api.getStoresByCity(e[0].id)))
    .subscribe

    this.api.getCitiesByCountry(this.selectedCountryIso).subscribe(cities => {
        this.cities = cities;
        this.selectedCityId = cities[0].id;
        this.loadStoresByCurrentCity();
    })
  }

  loadStoresByCurrentCity() {
    this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
      this.stores = stores;
      this.couponForm.storeId = stores[0].id;
    });
  }

  validateBF() {   
    this.api.checkBF(this.couponForm.bf, this.couponForm.storeId).toPromise()
    .then(r => {
      this.isConfirmationDialogDisplayed = true;
      return this.waitForYes();
    }).then(x => {
      this.isConfirmationDialogDisplayed = false;
      return this.api.requestCoupon(this.couponForm).toPromise();
    }).then(code => this.couponCode = code);
  }


  @ViewChild("yesButton")
  yesButton : ElementRef;
  
  waitForYes() {
    return new Promise((success, error) => {
      this.yesButton.nativeElement.onclick = success;
    });
  }



}
