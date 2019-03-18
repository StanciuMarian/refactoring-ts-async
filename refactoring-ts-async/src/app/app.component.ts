import { Component } from '@angular/core';
import { CityDto } from './api/dto/CityDto';
import { AppApi } from './api/app-api';
import { UserApi } from './api/user-api';
import { forkJoin } from 'rxjs';
import { UserDto } from './api/dto/UserDto';
import { CountryDto } from './api/dto/CountryDto';
import { StoreDto } from './api/dto/StoreDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  countries: CountryDto[] = [];
  cities: CityDto[] = [];
  stores: StoreDto[] = [];
  currentUser : UserDto;

  selectedCountryId: number;
  selectedCityId: number;
  selectedStoreId: number;

  isConfirmationDialogDisplayed = false;

  constructor(private api: AppApi, private userApi: UserApi) {}

  ngOnInit() {

    forkJoin(this.userApi.getCurrentUser(), this.api.getAllCountries()).subscribe(data => {
      this.currentUser = data[0];
      this.selectedCountryId = this.currentUser.countryId;      
      this.countries = data[1];   
      this.getCities();
    });

  }

  getCities() {
    this.api.getCitiesByCountry(this.selectedCountryId).subscribe(cities => {
      this.cities = cities;
      this.selectedCityId = cities[0].id; // TODO select current user city
      this.getStoresByCity(this.selectedCityId);
    })
  }

  getStoresByCity(cityId: number) {
    this.api.getStoresByCity(cityId).subscribe(stores => {
      this.stores = stores;
      this.selectedStoreId = stores[0].id;
    });
  }

  showConfirmationDialog() {
    this.isConfirmationDialogDisplayed = true;
  }

  resetForm() {

  }
}
