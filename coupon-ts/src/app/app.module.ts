import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { AppComponent } from './app.component';
import { RedeemCouponComponent } from './redeem-coupon/redeem-coupon.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpRequestsInterceptor } from './services/http-interceptor.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    RedeemCouponComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DialogModule,
    ToastModule,
    RouterModule.forRoot([
      {
        path: '',
        component: RedeemCouponComponent
      }
    ])
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestsInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
