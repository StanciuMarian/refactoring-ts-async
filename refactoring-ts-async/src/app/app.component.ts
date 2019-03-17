import { Component } from '@angular/core';
import { CityDto } from './api/dto/CityDto';
import { SubsidiaryDto } from './api/dto/SubsidiaryDto';
import { OperationDto } from './api/dto/OperationDto';
import { AppApi } from './api/app-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  isConfirmationDialogDisplayed = false;
  cities: CityDto[] = [];
  subsidiaries: SubsidiaryDto[] = [];
  operations: OperationDto[] = [];

  selectedCityCode: string;

  constructor(private api: AppApi) {}

  ngOnInit() {
    this.api.getCities().subscribe(cities => {
        this.cities = cities;
        this.selectedCityCode = cities[0].cityCode;
        this.getSubsidiaries(this.selectedCityCode);
        this.getOperations();
    })
  }

  getSubsidiaries(cityCode: string) {
    this.api.getSubsidiariesByCityCode(cityCode).subscribe(subsidiaries => {
      this.subsidiaries = subsidiaries;
    })
  }

  getOperations() {
    this.api.getOperations().subscribe(operations => this.operations = operations);
  }

  showConfirmationDialog() {
    this.isConfirmationDialogDisplayed = true;
  }

  resetForm() {

  }
}
