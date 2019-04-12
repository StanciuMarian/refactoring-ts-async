import { Component } from '@angular/core';
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
    this.userApi.getCurrentUser().toPromise().then(user => {
      this.user = user;
      if (this.countries) this.onReceivedBothCountriesAndUser();
    })
    .catch(() => console.log('error on first request'));

    this.api.getAllCountries().toPromise().then(countries => {
      this.countries = countries;
      if (this.user) this.onReceivedBothCountriesAndUser();
    })
    .catch(() => console.log('error on first request'))
  } 
  user : UserDto;

  onReceivedBothCountriesAndUser() {
    for (let c of this.countries) {
      if (c.id == this.user.countryId) {
        this.selectedCountryIso = c.iso;
      }
    }
    this.api.getCitiesByCountry(this.selectedCountryIso).toPromise()
      .then(cities => {
          this.cities = cities;
          this.selectedCityId = this.user.cityId; 
          this.api.getStoresByCity(this.selectedCityId).toPromise()
            .then(stores => {
              this.stores = stores;
              this.couponForm.storeId = stores[0].id;
            })
            .catch(() => console.log('error on third request'))
      })
      .catch(() => console.log('error on second request'))
  }

  onCountryChanged(selectedCountryIso:string) { 
    this.api.getCitiesByCountry(selectedCountryIso).toPromise()
      .then(cities => {
          this.cities = cities;
          this.selectedCityId = cities[0].id;
          this.api.getStoresByCity(this.selectedCityId).toPromise()
            .then(stores => {
              this.stores = stores;
              this.couponForm.storeId = stores[0].id;
            })
            .catch(() => console.log('error on third request'))
      })
      .catch(() => console.log('error on second request'))

  }

  validateBF(): void {   
    this.api.checkBF(this.couponForm.bf, this.couponForm.storeId).subscribe(response => {
      this.isConfirmationDialogDisplayed = true;
    })
  }

  redeemCoupon(): void {
    this.isConfirmationDialogDisplayed = false;
    this.api.requestCoupon(this.couponForm).subscribe((redeemCode) => {
      this.toastr.success("Success", `Your redeem code is ${redeemCode}`);
      this.couponCode = redeemCode;
    })
  }


}
