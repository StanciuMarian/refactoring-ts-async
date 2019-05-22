import { Component, ViewChild, ElementRef } from '@angular/core';
import { CountryDto } from '../api/dto/CountryDto';
import { CityDto } from '../api/dto/CityDto';
import { StoreDto } from '../api/dto/StoreDto';
import { UserDto } from '../api/dto/UserDto';
import { CouponForm } from '../api/dto/CouponForm';
import { AppApi } from '../api/app-api';
import { UserApi } from '../api/user-api';

@Component({
  selector: 'redeem-coupon-form',
  templateUrl: './redeem-coupon.component.html'
})
export class RedeemCouponComponent {

  countries: CountryDto[] = [];
  cities: CityDto[] = [];
  stores: StoreDto[] = [];

  couponForm = new CouponForm();
  
  // not part of the submitted form:
  selectedCountryIso: string; 
  selectedCityId: number;
  user : UserDto;

  returnedCouponCode: string; // result from server to display

  isConfirmationDialogDisplayed = false;

  constructor(private api: AppApi, private userApi: UserApi) {}

  ngOnInit() {
    this.userApi.getCurrentUser().subscribe(user => {
      this.user = user;
      if (this.countries.length > 0) this.onReceivedBothCountriesAndUser();
    });
    this.api.getAllCountries().subscribe(countries => {
      this.countries = countries;
      if (this.user) this.onReceivedBothCountriesAndUser();
    });
  } 

  onReceivedBothCountriesAndUser() {
    this.selectedCountryIso = this.countries.find(c => c.id == this.user.countryCode).iso;

    this.api.getCitiesByCountry(this.selectedCountryIso).subscribe(cities => {
      this.cities = cities;
      this.selectedCityId = cities[0].id; 
      this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
        this.stores = stores;
        this.couponForm.storeId = stores[0].id;
      });
    });
  }

  loadCitiesByCurrentCountry(selectedCountryIso:string) { 
    this.api.getCitiesByCountry(selectedCountryIso).subscribe(cities => {
      this.cities = cities;
      this.selectedCityId = cities[0].id;
      this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
        this.stores = stores;
        this.couponForm.storeId = stores[0].id;
      });
    });
  }

  onSubmitClick(): void {   
    this.api.validateReceiptId(this.couponForm.receiptId, this.couponForm.storeId).subscribe(() => {
      this.showConfirmationDialog();
    });
  }

  redeemCoupon(): void {
    this.hideConfirmationDialog();
    this.api.requestCoupon(this.couponForm).subscribe(redeemCode => {
      this.returnedCouponCode = redeemCode;
    });
  }

  showConfirmationDialog() {
    this.isConfirmationDialogDisplayed = true;
  }
  hideConfirmationDialog() {
    this.isConfirmationDialogDisplayed = false;
  }
}
