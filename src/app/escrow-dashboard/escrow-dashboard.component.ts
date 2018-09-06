import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild, HostListener, HostBinding  } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { OverlayContainer} from '@angular/cdk/overlay';
import { BlockchainService } from '../blockchain.service';
import { FromToServiceService } from './../from-to-service.service';
import { Helper } from '../helper';
import { Transactions, TransactionPhase } from '../model';
import { Title } from '@angular/platform-browser';
import { SocketService } from '../socket.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-escrow-dashboard',
  templateUrl: './escrow-dashboard.component.html',
  styleUrls: ['./escrow-dashboard.component.css']
})
export class EscrowDashboardComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public ls:number;
  public helper:Helper;
  public disableDetails=true;
  public transactions:Transactions[];
  public selectedTransRow:number;
  public selectedTpRow:number;
  public proceedDisable=true;
  public prog = false;
  public dark= false;
  public tsp;
  public isDisabled=true;
  public selectedTab;

  constructor(private overlay: OverlayContainer, private socketService: SocketService,private titleService:Title,private _fromToService:FromToServiceService,private _myService:BlockchainService) {
    this.helper=new Helper(socketService,_fromToService,_myService)
   }

   displayedColumns: string[] = [ 'title', 'escrow', 'seller', 'bank', 'price', 'tStatus' ];
   @HostBinding('class') componentCssClass;
   toggleTheme(): void {
     console.log('toggle called');
     console.log('dark:', this.dark);
     if (this.overlay.getContainerElement().classList.contains("custom-theme")) {
       this.overlay.getContainerElement().classList.remove("custom-theme");
       this.overlay.getContainerElement().classList.add("light-custom-theme");
     } else if (this.overlay.getContainerElement().classList.contains("light-custom-theme")) {
       this.overlay.getContainerElement().classList.remove("light-custom-theme");
       this.overlay.getContainerElement().classList.add("custom-theme");
     } else {
       this.overlay.getContainerElement().classList.add("light-custom-theme");
     }
     if (document.body.classList.contains("custom-theme")) {
       document.body.classList.remove("custom-theme");
       document.body.classList.add("light-custom-theme");
     } else if (document.body.classList.contains("light-custom-theme")) {
       document.body.classList.remove("light-custom-theme");
       document.body.classList.add("custom-theme");
     } else {
       document.body.classList.add("light-custom-theme");
     }
   }
 
   async toggle(){
     await this.toggleTheme()
     this.toggleTheme()
   }

   @HostListener('document:click', ['$event']) clickedOutside($event){
    if($event.target.nodeName!='TD'){
      this.selectedTpRow=99;
      this.proceedDisable=true;
    }
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    if(tabChangeEvent.tab.textLabel=="Approval Requests/Notifications"){
      this.addProg();
    }
    else{
      this.remProg();
    }
  }
 
   ngOnInit() {
     this.toggleTheme();
    this.titleService.setTitle('Escrow');
    this._fromToService.enroll().subscribe(data => {
      this.helper.setToken(data.token);
      this.getAllTps().then(()=>{
        //this.helper.checkStatus();
 
      }).catch(e=>{
        console.log('Encountered error while retrieving data from server');
        
      })
    
    document.body.classList.remove('bg-img');
  })
  this.helper.initIoConnection();
}


//*******************TP TABLE********** */
async getAllTps(){
  await this._fromToService.getAllTps(this.helper.getToken()).subscribe(data=>{
    this.helper.tps=data;
    this.tsp=data;
  })
}
onTpRowSelect(i: number) {
  this.selectedTpRow = i;
  this.proceedDisable=false;
}
onProceed(){
  this.helper.setProperty(this.helper.tps[this.selectedTpRow].property);
  this.helper.checkStatus();
  this.isDisabled=false;
  this.selectedTab=1;
  this.prog=true;
}
getTransStatus(i:number){
  return this.helper.getTransStatus(i);

}
//************************************************* */
addProg(){
  this.prog = true;
}

remProg(){
  this.prog = false;
}

  check1not(){
    
    if(this.helper.getTransState()>=5){
      return true;
    }
    else{
      return false;
    }
  }
  check2not(){
    if(this.helper.getTransState()>=6){
      return true;
    }
    else{
      return false;
    }
  }
  check3not(){
    if(this.helper.getTransState()>=8){
      return true;
    }
    else{
      return false;
    }
  }
  check3Approval(){
    if(this.helper.getTransState()>=9){
      return true;
    }
    else{
      return false;
    }
    
  }
  approve3(from,to){
    this.helper.moveAmount(from,to,'FULL',9);
  }  
  check4not(){
    if(this.helper.getTransState()>=9){
      return true;
    }
    else{
      return false;
    }
  }
  check4Approval(){
    if(this.helper.getTransState()>=10){
      return true;
    }
    else{
      return false;
    }
    
  }
  
  approve4(){
    this.helper.move('Escrow', 'Bank', 'Title','10')
    

  }
  view(docType){
    this.helper.view(docType);
  }

}