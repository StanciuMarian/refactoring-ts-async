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
import { mergeMap } from 'rxjs/operators';
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

  couponCode: string; // TODO display in page.

  isConfirmationDialogDisplayed = false;

  constructor(private api: AppApi,
            private userApi: UserApi,
            private toastr: Toastr) {}

  ngOnInit() {
    forkJoin(this.userApi.getCurrentUser(),  this.api.getAllCountries()).subscribe(dtos => {
      this.user = dtos[0];
      this.countries = dtos[1];
      this.onReceivedBothCountriesAndUser();
    });
  } 
  user : UserDto;

  onReceivedBothCountriesAndUser() {
    this.selectedCountryIso = this.countries.find(c => c.id == this.user.countryId).iso;

    this.loadCitiesByCurrentCountry();
  }

  loadCitiesByCurrentCountry() { 
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
      this.waitForYes().then(x => {
        this.isConfirmationDialogDisplayed = false;
        this.api.requestCoupon(this.couponForm).toPromise().then(code => this.couponCode = code);
      });

    });
  }


  @ViewChild("yesButton")
  yesButton : ElementRef;
  
  waitForYes() {
    return new Promise((success, error) => {
      this.yesButton.nativeElement.onclick = success;
    });
  }



}
