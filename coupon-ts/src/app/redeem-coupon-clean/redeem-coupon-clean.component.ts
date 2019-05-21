import { Component, ViewChild, ElementRef } from '@angular/core';
import { CountryDto } from '../api/dto/CountryDto';
import { CityDto } from '../api/dto/CityDto';
import { StoreDto } from '../api/dto/StoreDto';
import { UserDto } from '../api/dto/UserDto';
import { CouponForm } from '../api/dto/CouponForm';
import { AppApi } from '../api/app-api';
import { UserApi } from '../api/user-api';
import { forkJoin, Observable, observable, fromEvent, Subject } from 'rxjs';
import { Toastr } from '../services/toastr.service';

@Component({
  selector: 'redeem-coupon-form',
  templateUrl: './redeem-coupon-clean.component.html'
})
export class RedeemCouponCleanComponent {

  countries: CountryDto[] = [];
  cities: CityDto[] = [];
  stores: StoreDto[] = [];

  coupon = new CouponForm();
  selectedCountryIso: string;
  selectedCityId: number;

  isConfirmationDialogDisplayed = false;

  @ViewChild("yesButton")
  yesButton : ElementRef;

  constructor(private api: AppApi,
            private userApi: UserApi,
            private toastr: Toastr) {}

  ngOnInit(): void {
    forkJoin(this.userApi.getCurrentUser(), this.api.getAllCountries()).subscribe(data => {
      this.countries = data[1];   
      this.initCurrentUser(data[0]);
      this.getCities();
    });
  }

  initCurrentUser(currentUser: UserDto) {
    this.selectedCountryIso = this.countries.find(country => country.id == currentUser.countryId).iso;
    this.selectedCityId = currentUser.cityId;
  }

  getCities(): void {
    this.api.getCitiesByCountry(this.selectedCountryIso).subscribe(cities => {
      this.cities = cities;      
      if (!this.cities.find(c => c.id == this.selectedCityId)) {
        this.selectedCityId = this.cities[0].id;
      }
      this.getStoresByCity();
    })
  }

  getStoresByCity(): void {
    this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
      this.stores = stores;
      this.coupon.storeId = stores[0].id;
    });
  }


  async validateBF() {
    await this.api.checkBF(this.coupon.bf, this.coupon.storeId).toPromise();
    this.showConfirmationDialog();
    await this.waitForYes();
    const redeemCode = await this.api.requestCoupon(this.coupon).toPromise();
    this.toastr.success("Success", `Your redeem code is ${redeemCode}`);
    this.hideConfirmationDialog();  
  }

  yesSubject = new Subject();

  async waitForYes() {
    return new Promise((success, error) => {
      this.yesButton.nativeElement.onclick = success;
      // this.yesButton.nativeElement.addEventListener("click", success);
    });
  }

  showConfirmationDialog() {
    this.isConfirmationDialogDisplayed = true;
  }

  hideConfirmationDialog(): void {
    this.isConfirmationDialogDisplayed = false;
  }
}
