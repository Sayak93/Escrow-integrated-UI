import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';


import { Helper } from '../helper';
import { BlockchainService } from '../blockchain.service';
import { Property, Transactions, TransactionPhase } from '../model';
import { FromToServiceService } from './../from-to-service.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Title } from '@angular/platform-browser';
import { SocketService } from '../socket.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public selectedTpRow:number;
  

  public disableFlag=true;
  public disableAdd=true;
  // public pp=properties;
  public pp:Property[];
  modalRef: BsModalRef;
  // public ls:number;
  public helper:Helper;
  constructor(private socketService: SocketService,private titleService:Title,private _fromToService:FromToServiceService,private _myService:BlockchainService,private modalService: BsModalService) {
    this.helper=new Helper(socketService,_fromToService,_myService)
   }
  public selectedRow:number;
  public n_id:String;
  public ntitle='';
  public nlocation='';
  public nprice:number;
  public ncontact:number;
  public apporve1_inv=true;
  public apporve2_inv=true;
  public prog = false;
  public proceedDisable=true;
  
  //******************************************INTEGRATION ************/

  ngOnInit() {    
    
    this.titleService.setTitle('Seller');
    this.staticTabs.tabs[2].disabled = true;
    document.body.classList.remove('bg-img');
    this._fromToService.enroll().subscribe(data=>{
      this.helper.setToken(data.token);
      
      // this.helper.checkStatus();
      this.getProperties();
      this.getAllTps();
      this.helper.initIoConnection()
    });
    
    //this.loadjquery();
    
    
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
  this.staticTabs.tabs[2].disabled = false;
  this.staticTabs.tabs[2].active = true;
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

  async getProperties(){
    // this._myService.properties.subscribe(data=>{
    //   this.pp=data;
    // });
    await this._fromToService.getAllProp(this.helper.getToken()).subscribe(props=>{
      this.pp=props;
    })
  }
  loadjquery(){
    $('#myTable').on('click', '.clickable-row', function (event) {
      if ($(this).hasClass('bg-primary')) {
        $('#deleteButton').attr("disabled", "disabled");
        $(this).removeClass('bg-primary');
      } else {
        $('#deleteButton').removeAttr("disabled");
        $(this).addClass('bg-primary').siblings().removeClass('bg-primary');
        console.log(this.disableDelete);
        
      }
    });
  }
  onRowSelect(i:number){
    this.disableFlag=false;
    this.selectedRow=i
  }
  onDelete(){
    let property=this.pp[this.selectedRow];
    let id=property._id;
    //this._myService.deleteProperty(property,this.pp);
    this._fromToService.deleteProp(id,this.helper.getToken()).subscribe(async data=>{
      this.getProperties().then(()=>{
        if(this.pp.length==0){
          this.disableFlag=true;
          }
      }).catch(e=>{
        console.log('Encountered error while deleting property');
        
      });
      
    })
    
  }
  openModal(template: TemplateRef<any>) {
    this.ntitle='';this.nlocation='';this.nprice=null;this.ncontact=null;
    this.modalRef = this.modalService.show(template);
  }
  checkAddDisable(){
    if(this.ntitle=='' || this.nlocation==''||this.nprice==null || this.ncontact==null){
      return true;
    }else{
      return false;
    }
  }
  onAdd(){
    let prop={
      // _id:this.n_id,
      _id:'',
      title:this.ntitle,
      location:this.nlocation,
      price:this.nprice,
      contact:this.ncontact
    };
    // this._myService.addProperty(prop,this.pp);
    // this.getProperties();
    this._fromToService.addProp(prop,this.helper.getToken()).subscribe(async data=>{
      this.getProperties().then(()=>{
        console.log('Successfully added property');
      }).catch(e=>{
        console.log('Encountered error while deleting property');
        
      });
      
    })
  }
  check1not(){
    
    if(this.helper.getTransState()>=1){
      return true;
    }
    else{
      return false;
    }
  }
  check1Approval(){
    if(this.helper.getTransState()>=2){
      return true;
    }
    else{
      return false;
    }
    
  }
  approve1(){
    this.helper.move('Seller', 'Buyer', 'TitleRecord','2');
    
    
    
  }
  check2not(){
    if(this.helper.getTransState()>=5){
      return true;
    }
    else{
      return false;
    }
  }
  
  check2Approval(){
    if(this.helper.getTransState()>=6){
      return true;
    }
    else{
      return false;
    }
    
  }
  
  approve2(){
    this.helper.move('Seller', 'Escrow', 'Title','6');

  }
  check3not(){
    if(this.helper.getTransState()>=9){
      return true;
    }
    else{
      return false;
    }
  }
  //*************************************************************************** */
  //**************INTEGRATION STARTS************************************ *//
  // //**********UPLOAD TITLE********** */
  async titleUp(files: FileList){
    this.helper.titleUp(files);
  }
  
  
  //*********UPLOAD RECORD************ */
  async titleRecordUp(files: FileList){
    this.helper.titleRecordUp(files);
  }

   
  
}
