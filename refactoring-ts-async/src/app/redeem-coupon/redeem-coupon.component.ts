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
  //poate putem porni de la asta? 
  //aplicatia functioneaza si daca scrii asa :)
  //nu e la fel de rau ca si cu callback-uri dar tot e foarte urat codul 

  // V: OK! E suficient de naspa, indeed.
  // V: un singur pas mai naspa putem face: ca cele doua promise-uri sa verifice din callback func lor fiecare daca a terminat cealalta:

  // V: mai trebuie ceva: orasele sa se obtina dupa codul tarii, ca sa ai nevoie si de tarile array si de user.countryId  sa vina ca sa obtii codul tarii.

  // varianta mea naspa de start:

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
    this.selectedCountryIso = this.countries.find(country => country.id == this.user.countryId).iso;
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

  onCountryChanged(selectedCountryIso:string) { //acel antipattern de care vorbeam
    //urmeaza cod copiat
    this.api.getCitiesByCountry(selectedCountryIso).toPromise()
      .then(cities => {
          this.cities = cities;
          // this.selectedCityId = this.user.cityId; //DELETE
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

  // lasam si bug-ul ca la schimbarea selectiei combo2 nu se mai cer datele pt combo 3.


  // varianta ta naspa de start:

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
  // } 
  
  //am putea sa bagam interceptorul ca mecanism de tratare a erorilor in angular si cum sa scapi de catch-urile alea
  // DAP, ok! Initial le avem pe astea, dar apoi refactoram la filtrul ala al nostru.


  // ngOnInit(): void {
  //   //poate o putin fortat forkJoin-ul aici
  //   //orasele oricum nu sunt initializate decat cand se incarca userul 
  //   //ai putea incarca userul si apoi sa iei si orasele, nu trebuie sa le iei simultan

  //   // V: da, dar cica pentru performanta vrei sa le incarci in paralel :P
  //   forkJoin(this.userApi.getCurrentUser(), this.api.getAllCountries()).subscribe(data => {
  //     this.countries = data[1];   
  //     this.initCurrentUser(data[0]);
  //     this.getCities();
  //   });
  // }

  // initCurrentUser(currentUser: UserDto) {
  //   //mai trebuie sa salvam userul daca il folosim doar la initializarea asta ???
  //   //momentan l-am scos

  //   //V: OK, corect !!
  //   this.selectedCountryId = currentUser.countryId;
  //   this.selectedCityId = currentUser.cityId;
  // }

  // getCities(): void {
  //   this.api.getCitiesByCountry(this.selectedCountryId).subscribe(cities => {
  //     this.cities = cities;
  //     this.getStoresByCity();
  //   })
  // }

  // getStoresByCity(): void {
  //   this.api.getStoresByCity(this.selectedCityId).subscribe(stores => {
  //     this.stores = stores;
  //     this.coupon.storeId = stores[0].id;
  //   });
  // }

  modalObserv = new Subject();

  validateBF(): void {   

    this.api.checkBF(this.couponForm.bf, this.couponForm.storeId)
    .pipe(mergeMap(this.showConfirmationDialog.bind(this)))
    .pipe(mergeMap(() => this.api.requestCoupon(this.couponForm)))
    .subscribe((couponCode) => this.couponCode = couponCode)
  }

  //apasa OK
  redeemCoupon(): void {
    this.modalObserv.next();
    this.hideConfirmationDialog();
    // this.api.requestCoupon(this.coupon).subscribe((redeemCode) => {
    //   this.toastr.success("Success", `Your redeem code is ${redeemCode}`);
    //   this.hideConfirmationDialog();
    // })
  }

  //sa scoatem modala separat sa comunica cu componenta asta prin serviciu ? 
  //nu prea e legat de asincronism, dar am putea arata ce mai poti face cu observables

  // V: schiteaza si codul pentru asta, da. Daca ne miscam repede poate incape si aia (alegem la runtime :)

  showConfirmationDialog(): Subject<any> {
    this.isConfirmationDialogDisplayed = true;
    return this.modalObserv;
  }

  hideConfirmationDialog(): void {
    this.isConfirmationDialogDisplayed = false;
  }
}
