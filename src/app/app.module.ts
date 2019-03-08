import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BuyerDashboardComponent } from './buyer-dashboard/buyer-dashboard.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { BankDashboardComponent } from './bank-dashboard/bank-dashboard.component';
import { EscrowDashboardComponent } from './escrow-dashboard/escrow-dashboard.component';
import { BlockchainService } from "./blockchain.service";
import { BuyerTransactionComponent } from './buyer-transaction/buyer-transaction.component';
import { BalanceTransferComponent } from './balance-transfer/balance-transfer.component';
import { FromToServiceService } from './from-to-service.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TransTableComponent } from './trans-table/trans-table.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    BuyerDashboardComponent,
    SellerDashboardComponent,
    BankDashboardComponent,
    EscrowDashboardComponent,
    BuyerTransactionComponent,
    BalanceTransferComponent,
    LandingPageComponent,
    TransTableComponent
  ],
  imports: [
    CarouselModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    HttpClientModule

  ],
  providers: [FromToServiceService,BlockchainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
