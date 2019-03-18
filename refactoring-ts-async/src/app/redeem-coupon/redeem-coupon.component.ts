import { Component } from '@angular/core';
import { CountryDto } from '../api/dto/CountryDto';
import { CityDto } from '../api/dto/CityDto';
import { StoreDto } from '../api/dto/StoreDto';
import { UserDto } from '../api/dto/UserDto';
import { CouponForm } from '../api/dto/CouponForm';
import { AppApi } from '../api/app-api';
import { UserApi } from '../api/user-api';
import { forkJoin } from 'rxjs';
import { Toastr } from '../services/toastr.service';

@Component({
  selector: 'redeem-coupon-form',
  templateUrl: './redeem-coupon.component.html'
})
export class RedeemCouponComponent {

  countries: CountryDto[] = [];
  cities: CityDto[] = [];
  stores: StoreDto[] = [];
  currentUser : UserDto;

  coupon = new CouponForm();
  selectedCountryId: number;
  selectedCityId: number;

  isConfirmationDialogDisplayed = false;

  constructor(private api: AppApi,
            private userApi: UserApi,
            private toastr: Toastr) {}

  ngOnInit(): void {
    forkJoin(this.userApi.getCurrentUser(), this.api.getAllCountries()).subscribe(data => {
      this.currentUser = data[0];
      this.countries = data[1];   
      this.selectedCountryId = this.currentUser.countryId;      
      this.getCities();
    });

  }

  getCities(): void {
    this.api.getCitiesByCountry(this.selectedCountryId).subscribe(cities => {
      this.cities = cities;
      this.selectedCityId = this.currentUser.cityId;
      this.getStoresByCity(this.selectedCityId);
    })
  }

  getStoresByCity(cityId: number): void {
    this.api.getStoresByCity(cityId).subscribe(stores => {
      this.stores = stores;
      this.coupon.storeId = stores[0].id;
    });
  }

  validateBF(): void {
    this.api.checkBF(this.coupon.bf, this.coupon.storeId).subscribe(() => {
      this.showConfirmationDialog();
    })
  }

  redeemCoupon(): void {
    this.api.requestCoupon(this.coupon).subscribe((redeemCode) => {
      this.toastr.success("Success", `Your redeem code is ${redeemCode}`);
      this.hideConfirmationDialog();
    })
  }

  showConfirmationDialog() {
    this.isConfirmationDialogDisplayed = true;
  }

  hideConfirmationDialog() {
    this.isConfirmationDialogDisplayed = false;
  }
}
