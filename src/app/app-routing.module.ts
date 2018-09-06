import { EscrowDashboardComponent } from './escrow-dashboard/escrow-dashboard.component';
import { BankDashboardComponent } from './bank-dashboard/bank-dashboard.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { BuyerDashboardComponent } from './buyer-dashboard/buyer-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BuyerTransactionComponent } from './buyer-transaction/buyer-transaction.component';
import { BalanceTransferComponent } from './balance-transfer/balance-transfer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';



const routes: Routes = [
  {path:'',redirectTo:'/landing',pathMatch:'full'},
  {path:'landing',component:LandingPageComponent,data:{title:'About'}},
  {path:'login',component:LoginComponent,data:{title:'Login'}},
  {path:'buyer',component:BuyerDashboardComponent,data:{title:'Buyer'}},
  {
    path:'buyer/:id',
    component:BuyerTransactionComponent,
    data:{title:'Buyer'}
  },
  {path:'bt',component:BalanceTransferComponent},
  {path:'seller',component:SellerDashboardComponent,data:{title:'Seller'}},
  {path:'bank',component:BankDashboardComponent,data:{title:'Bank'}},
  {path:'escrow',component:EscrowDashboardComponent,data:{title:'Escrow'}},
  {path:'**',component:PageNotFoundComponent,data:{title:'Page Not Found'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
