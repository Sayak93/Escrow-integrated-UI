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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';

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
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatPaginatorModule

  ],
  providers: [FromToServiceService,BlockchainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
