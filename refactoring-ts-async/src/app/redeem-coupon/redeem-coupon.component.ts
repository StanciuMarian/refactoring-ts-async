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
      forkJoin(this.userApi.getCurrentUser(),this.api.getAllCountries())
      .subscribe(data =>{
        let user = data[0];
        this.countries = data[1];
        this.initUserData(user); 
        this.loadCities();
      })
  } 

  private initUserData(user: UserDto) {
    this.selectedCountryIso = this.countries.find(c => c.id == user.countryId).iso;
    this.selectedCityId = user.cityId;
  }

  loadCities() { 
    this.api.getCitiesByCountry(this.selectedCountryIso).subscribe(cities => {
        this.cities = cities;
        if (!this.cities.find(c => c.id == this.selectedCityId)) {
          this.selectedCityId = cities[0].id;
        }
        this.loadStores();
    });
  }

  loadStores() {
    this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
        this.stores = stores;
        this.couponForm.storeId = stores[0].id;
      });
  }

  async validateBF() {      
    await this.api.checkBF(this.couponForm.bf, this.couponForm.storeId).toPromise();
    this.showConfirmationDialog();
    await this.getPromiseForClick();
    this.hideConfirmationDialog();
    this.couponCode = await this.api.requestCoupon(this.couponForm).toPromise();
    this.toastr.success("Success", `Your redeem code is ${this.couponCode}`);
  }


  @ViewChild('yesButton') yesButton: ElementRef;

  getPromiseForClick() {
    return new Promise(success => {
      this.yesButton.nativeElement.onclick = success;
    })
  }

  hideConfirmationDialog() {
    this.isConfirmationDialogDisplayed = false;
  }
  showConfirmationDialog() {
    this.isConfirmationDialogDisplayed = true;
  }


}
