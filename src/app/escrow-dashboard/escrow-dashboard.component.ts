import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { BlockchainService } from '../blockchain.service';
import { FromToServiceService } from './../from-to-service.service';
import { Helper } from '../helper';
import { Transactions, TransactionPhase } from '../model';
import { Title } from '@angular/platform-browser';
import { SocketService } from '../socket.service';

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

  constructor(private socketService: SocketService,private titleService:Title,private _fromToService:FromToServiceService,private _myService:BlockchainService) {
    this.helper=new Helper(socketService,_fromToService,_myService)
   }

  
  ngOnInit() {
    this.titleService.setTitle('Escrow');
    this.staticTabs.tabs[1].disabled = true;
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
  })
}
onTpRowSelect(i: number) {
  this.selectedTpRow = i;
  this.proceedDisable=false;
}
onProceed(){
  this.helper.setProperty(this.helper.tps[this.selectedTpRow].property);
  this.helper.checkStatus();
  this.staticTabs.tabs[1].disabled = false;
  this.staticTabs.tabs[1].active = true;
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