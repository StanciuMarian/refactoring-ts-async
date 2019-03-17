import { Component } from '@angular/core';
import { AppApi } from './app-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private api: AppApi) {}

  ngOnInit() {
    this.api.getCities().subscribe(cities => {
        console.log(cities)      
        this.api.getSubsidiaries(cities[0].cityCode).subscribe(subsidiaries => console.log(subsidiaries))
    })
  }
}
