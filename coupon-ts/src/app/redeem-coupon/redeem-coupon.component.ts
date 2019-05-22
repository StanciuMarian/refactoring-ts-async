import { Component, ViewChild, ElementRef } from '@angular/core';
import { CountryDto } from '../api/dto/CountryDto';
import { CityDto } from '../api/dto/CityDto';
import { StoreDto } from '../api/dto/StoreDto';
import { UserDto } from '../api/dto/UserDto';
import { CouponForm } from '../api/dto/CouponForm';
import { AppApi } from '../api/app-api';
import { UserApi } from '../api/user-api';
import { forkJoin } from 'rxjs';

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

  returnedCouponCode: string; // result from server to display

  isConfirmationDialogDisplayed = false;

  constructor(private api: AppApi, private userApi: UserApi) {}

  ngOnInit() {
    forkJoin(this.userApi.getCurrentUser(), this.api.getAllCountries()).subscribe(dtos => {
      let user = dtos[0];
      this.countries = dtos[1];
      this.selectedCountryIso = this.countries.find(c => c.id == user.countryCode).iso;
      this.loadCitiesByCurrentCountry();
    });
  } 

  loadCitiesByCurrentCountry() { 
    this.api.getCitiesByCountry(this.selectedCountryIso).subscribe(cities => {
      this.cities = cities;
      this.selectedCityId = cities[0].id;
      this.loadStoresByCurrentCity();
    });
  }

  private loadStoresByCurrentCity() {
    this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
      this.stores = stores;
      this.couponForm.storeId = stores[0].id;
    });
  }

  async onSubmitClick() {   
    this.api.validateReceiptId(this.couponForm.receiptId, this.couponForm.storeId).toPromise()
    .then(() =>{
      this.showConfirmationDialog();
      return this.waitForYes();
    }).then(() =>{
      this.hideConfirmationDialog();
      return this.api.requestCoupon(this.couponForm).toPromise();
    }).then(couponCode => {
      this.returnedCouponCode = couponCode;
    });
  }

  @ViewChild("yesButton")
  yesButton: ElementRef;

  waitForYes() {
    return new Promise(resolve => this.yesButton.nativeElement.onclick = resolve);
  }

  showConfirmationDialog() {
    this.isConfirmationDialogDisplayed = true;
  }
  hideConfirmationDialog() {
    this.isConfirmationDialogDisplayed = false;
  }
}
