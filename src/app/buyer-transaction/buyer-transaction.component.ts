import { CurrencyPipe } from '@angular/common';
import { BlockchainService } from '../blockchain.service';
import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import * as CryptoJS from 'crypto-js';
import { OverlayContainer} from '@angular/cdk/overlay';
import { Helper } from '../helper';
import { Property } from '../model';
import { FromToServiceService } from './../from-to-service.service';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-buyer-transaction',
  templateUrl: './buyer-transaction.component.html',
  styleUrls: ['./buyer-transaction.component.css']
})
export class BuyerTransactionComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public pid: String;
  public property: Property;
  //public pp = properties;
  public SA = false;
  public EA = false;
  public RL = false;
  public TR = false;
  public RM = false;
  public prog = true;
  public cs = false;
  public helper:Helper;
  public dark


  constructor(private overlay: OverlayContainer,private socketService: SocketService,private titleService:Title,private _fromToService: FromToServiceService, private route: ActivatedRoute, private router: Router, private service: BlockchainService) {
    this.helper=new Helper(socketService,_fromToService,service)
  }
  //material
  @HostBinding('class') componentCssClass;
  toggleTheme(): void {
    console.log('toggle called');
    
    console.log('dark:',this.dark);
    
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

  goHome(){
    console.log('val of dark:', this.dark);    
    this.router.navigate(['/buyer', {isDark:this.dark}])
  }


  //******************************************INTEGRATION ************/

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.get('isDark')=='true'){
        this.dark=true;
      }
      else{
        this.dark=false
      }
      let id = params.get('id');
      this.pid = id;
      //this.property = this.pp.filter((pt) => pt._id == id)[0];
    })
    this.titleService.setTitle('Buyer');
    console.log('dark:',this.dark);
    this.property = new Property("","","",0,0);
  
    this.staticTabs.tabs[1].disabled = true;
    this.staticTabs.tabs[2].disabled = true;
    this.staticTabs.tabs[3].disabled = true;
    this.staticTabs.tabs[4].disabled = true;
    this._fromToService.enroll().subscribe(data => {
      //this.token = data.token;
      this.helper.setToken(data.token);
      
      this.getProperty();
      
    });
    this.helper.initIoConnection();
    
  }


  getProperty(){
     this._fromToService.getProp(this.pid,this.helper.getToken()).subscribe(prop => {
      this.property = prop;
      console.log(this.property);
        this.helper.setProperty(this.property);
        this.helper.checkStatus();
    })

  }

  selectTab(tabid: number) {

    this.staticTabs.tabs[tabid].disabled = false;
    this.staticTabs.tabs[tabid].active = true;

  }
  checkSA() {
    if (this.helper.getTransState() >= 2) {
      return true;
    }
    else {
      return false;
    }
  }
  sendRecord() {
    
    this.helper.move('Buyer', 'Bank', 'TitleRecord',3);
   
  }
  checkBankApproval() {
    if (this.helper.getTransState() >= 3) {
      return true;
    }
    else {
      return false;
    }
  }
  checkRL() {
    if (this.helper.getTransState() >= 4) {
      return true;
    }
    else {
      return false;
    }
  }
  onTransfer10(from, to) {

    this.helper.moveAmount(from,to,'Ten Percent',5);
  }

  checkTransfer() {
    if (this.helper.getTransState() == 5) {
      return true;
    }
    else {
      return false;
    }
  }
  checkEA() {
    if (this.helper.getTransState() >= 5) {
      return true;
    }
    else {
      return false;
    }
  }
  checkRM() {
    if (this.helper.getTransState() >= 7) {
      return true;
    }
    else {
      return false;
    }
  }
  checkTR() {
    if (this.helper.getTransState() >= 11) {
      return true;
    }
    else {
      return false;
    }
  }

  // //*****************INTEGRATION SERVICE***************** */
  view(docType){
    this.helper.view(docType);
  }
}
