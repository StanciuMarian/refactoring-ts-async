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

  async ngOnInit() {
    [this.user, this.countries] = await Promise.all([
      this.userApi.getCurrentUser().toPromise(),  
      this.api.getAllCountries().toPromise()]);
    this.selectedCountryIso = this.countries.find(c => c.id == this.user.countryId).iso;
    this.loadCitiesByCurrentCountry(); 
  } 

  loadCitiesByCurrentCountry() { 
    this.api.getCitiesByCountry(this.selectedCountryIso).subscribe(cities => {
        this.cities = cities;
        this.selectedCityId = cities[0].id;
        this.loadStoresByCurrentCity();
    });
  }

  loadStoresByCurrentCity() {
    this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
      this.stores = stores;
      this.couponForm.storeId = stores[0].id;
    });
  }

  async validateBF() {   
    await this.api.checkBF(this.couponForm.bf, this.couponForm.storeId).toPromise();
    this.isConfirmationDialogDisplayed = true;
    await this.waitForYes();
    this.isConfirmationDialogDisplayed = false;
    this.returnedCouponCode = await this.api.requestCoupon(this.couponForm).toPromise();
  }

  @ViewChild("yesButton")
  yesButton : ElementRef;
  
  async waitForYes() {
    return new Promise(success => this.yesButton.nativeElement.onclick = success);
  }

}
