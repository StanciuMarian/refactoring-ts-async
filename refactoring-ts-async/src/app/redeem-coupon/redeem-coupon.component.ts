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

  coupon = new CouponForm();
  selectedCountryId: number;
  selectedCityId: number;

  isConfirmationDialogDisplayed = false;

  constructor(private api: AppApi,
            private userApi: UserApi,
            private toastr: Toastr) {}
  //poate putem porni de la asta? 
  //aplicatia functioneaza si daca scrii asa :)
  //nu e la fel de rau ca si cu callback-uri dar tot e foarte urat codul 
  // ngOnInit() {
  //   let promise1 = this.userApi.getCurrentUser().toPromise();
  //   let promise2 = this.api.getAllCountries().toPromise();
  //   Promise.all([promise1, promise2])
  //     .then(data => {
  //       this.countries = data[1];
  //       this.selectedCountryId = data[0].countryId;
  //       this.api.getCitiesByCountry(this.selectedCountryId).toPromise()
  //         .then(cities => {
  //             this.cities = cities;
  //             this.selectedCityId = data[0].cityId; 
  //             this.api.getStoresByCity(this.selectedCityId).toPromise()
  //               .then(stores => {
  //                 this.stores = stores;
  //                 this.coupon.storeId = stores[0].id;
  //               })
  //               .catch(() => console.log('error on third request'))
  //         })
  //         .catch(() => console.log('error on second request'))
  //     })
  //     .catch(() => console.log('error on first request'))
  // } //am putea sa bagam interceptorul ca mecanism de tratare a erorilor in angular si cum sa scapi de catch-urile alea

  ngOnInit(): void {
    //poate o putin fortat forkJoin-ul aici
    //orasele oricum nu sunt initializate decat cand se incarca userul 
    //ai putea incarca userul si apoi sa iei si orasele, nu trebuie sa le iei simultan
    forkJoin(this.userApi.getCurrentUser(), this.api.getAllCountries()).subscribe(data => {
      this.countries = data[1];   
      this.initCurrentUser(data[0]);
      this.getCities();
    });
  }

  initCurrentUser(currentUser: UserDto) {
    //mai trebuie sa salvam userul daca il folosim doar la initializarea asta ???
    //momentan l-am scos
    this.selectedCountryId = currentUser.countryId;
    this.selectedCityId = currentUser.cityId;
  }

  getCities(): void {
    this.api.getCitiesByCountry(this.selectedCountryId).subscribe(cities => {
      this.cities = cities;
      this.getStoresByCity();
    })
  }

  getStoresByCity(): void {
    this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
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

  //sa scoatem modala separat sa comunica cu componenta asta prin serviciu ? 
  //nu prea e legat de asincronism, dar am putea arata ce mai poti face cu observables
  showConfirmationDialog(): void {
    this.isConfirmationDialogDisplayed = true;
  }

  hideConfirmationDialog(): void {
    this.isConfirmationDialogDisplayed = false;
  }
}
