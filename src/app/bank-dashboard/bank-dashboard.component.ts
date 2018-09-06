import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener, HostBinding } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { OverlayContainer} from '@angular/cdk/overlay';
import { Helper } from '../helper';
import { BlockchainService } from '../blockchain.service';
import { FromToServiceService } from './../from-to-service.service';
import { Transactions, TransactionPhase } from '../model';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Title } from '@angular/platform-browser';
import { SocketService } from '../socket.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-bank-dashboard',
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.css']
})
export class BankDashboardComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public helper: Helper;
  public disableDetails=true;
  public transactions:Transactions[];
  public selectedTransRow:number;
  public selectedTpRow:number;
  public prog = false;
  public proceedDisable=true;
  public dark= false;
  public tsp;
  public isDisabled=true;
  public selectedTab;
  public mUp=true;
  
  constructor(private overlay: OverlayContainer,private socketService: SocketService,private titleService:Title,private _fromToService: FromToServiceService, private _myService: BlockchainService, private router: Router, private route: ActivatedRoute) {
    this.helper = new Helper(socketService,_fromToService, _myService)
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

  ngOnInit() {
    this.toggleTheme();
    this.titleService.setTitle('Bank');
    this._fromToService.enroll().subscribe(data => {
      this.helper.setToken(data.token);
      this.getAllTps().then(()=>{
        //this.helper.checkStatus();
 
      }).catch(e=>{
        console.log('Encountered error while retrieving data from server');
        
      })
    
    document.body.classList.remove('bg-img');
  })
  this.helper.initIoConnection()
}


// @HostListener('window:focus', ['$event'])
// onFocus(event: any): void {
//     this.helper.checkStatus();

// }

// @HostListener('window:blur', ['$event'])
// onBlur(event: any): void {
//   this.helper.checkStatus();
  
// }



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

  check1not() {

    if (this.helper.getTransState() >= 3) {
      return true;
    }
    else {
      return false;
    }
  }
  check1Approval() {
    if (this.helper.getTransState() >= 4) {
      return true;
    }
    else {
      return false;
    }

  }
  approve1() {
    // localStorage.setItem('trans_Stage$','4');
    // this.checkStatus();
    let trp={
      _id:'',
      tp:4,
      property:this.helper.getProperty()
    } 
    this.helper.updateLs(trp);


  }
  check2not() {
    if (this.helper.getTransState() >= 6) {
      return true;
    }
    else {
      return false;
    }
  }
  check2Approval() {
    if (this.helper.getTransState() >= 7) {
      return true;
    }
    else {
      return false;
    }

  }

  approve2() {
    this.helper.move('Bank', 'Buyer', 'Mortgage', 7);


  }
  check3not() {
    if (this.helper.getTransState() >= 7) {
      return true;
    }
    else {
      return false;
    }
  }
  check3Approval() {
    if (this.helper.getTransState() >= 8) {
      return true;
    }
    else {
      return false;
    }

  }
  approve3(from, to) {
    this.helper.moveAmount(from, to, 'LOAN', 8);
  }

  check4not() {
    if (this.helper.getTransState() >= 10) {
      return true;
    }
    else {
      return false;
    }
  }
  check4Approval() {
    if (this.helper.getTransState() >= 11) {
      return true;
    }
    else {
      return false;
    }

  }
  approve4() {
    let trp={
      _id:'',
      tp:11,
      property:this.helper.getProperty()
    } 
    this.helper.updateLs(trp);

  }
  //*****************INTEGRATION SERVICE***************** */
  view(docType) {
    this.helper.view(docType);

  }
  //**************UPLOADING MORTGAGE************************* */
  async mortgageUp(files: FileList) {
    this.helper.mortgageUp(files);
    this.mUp=false;
  }

}
