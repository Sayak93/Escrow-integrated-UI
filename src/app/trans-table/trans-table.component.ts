import { Component, OnInit, Input, TemplateRef, HostListener } from '@angular/core';
import { Helper } from '../helper';
import { Transactions } from '../model';
import { FromToServiceService } from '../from-to-service.service';
import { BlockchainService } from '../blockchain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-trans-table',
  templateUrl: './trans-table.component.html',
  styleUrls: ['./trans-table.component.css']
})
export class TransTableComponent implements OnInit {

  @Input() public helper: Helper;
  public disableDetails=true;
  public transactions:Transactions[];
  public selectedTransRow:number;
  public TransDet:Array<any>;
  public tType;
  public amt = false
  public ass = false
  public to
  public from
  public toBal
  public fromBal
  public tAmt
  public co
  public po
  public t
  public coVal
  public poVal
  public tVal
  public data
  public tid
  modalRef: BsModalRef;
  config = {
    animated: true
  };

  constructor(private socketService: SocketService,private modalService: BsModalService, private _fromToService: FromToServiceService, private _myService: BlockchainService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initIoConnection();
    
  }
  public initIoConnection(): void {
    this.socketService.initSocket();
    this.socketService.onTids()
    .subscribe((data) => {
    //console.log("******FROM TRANS TABLE ",data);
    this.transactions=data;
    
    });

  }

@HostListener('window:focus', ['$event'])
onFocus(event: any): void {
this.getAllTids();

}

// @HostListener('window:blur', ['$event'])
// onBlur(event: any): void {
//   this.getAllTids();
  
// }



  async getAllTids(){
    await this._fromToService.getAllTid(this.helper.getToken()).subscribe(data=>{
      this.transactions=data;
    })
    
  }
  toDate(t){
    return this.helper.toDate(t);
  }
  async onDetails(){

    let trans=this.transactions[this.selectedTransRow];
    let tid = trans.tId;
    let token = this.helper.getToken();
    await this._fromToService.view(tid, token).subscribe(data=>{
      var arr = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes;
      this.tid = trans.tId
      //this.TransDet = arr;
      if(trans.tType=='Amount'){
        this.TransDet = arr;
        this.amt = true;
        this.tType = "Fund Transfer"
        this.from = arr[0].key;
        this.fromBal = arr[0].value;
        this.to = arr[1].key;
        this.toBal = arr[1].value;
        this.tAmt = arr[2].value;
        this.ass = false
      //  this.modalRef = this.modalService.show(template, this.config);
      }
      else{
        console.log(data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset);
         this.ass = true;
         this.amt = false;
         this.tType = "Asset Transfer"
         this.data = JSON.stringify(data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset, undefined, 2);
        // this.modalRef = this.modalService.show(template, this.config);
         console.log(data);
         
        if(arr.length==2){
          this.poVal = "No Previous Owners"
          this.po = "Previous TitleRecord Owner"
          this.t = arr[1].key;
          this.tVal = arr[1].value
        }
        else{
          this.poVal = arr[1].value
          this.po = arr[1].key
        }
        this.co = arr[0].key
        this.coVal = arr[0].value
        this.t = arr[2].key;
        this.tVal = arr[2].value

       // this.modalRef = this.modalService.show(template, this.config);
      }  
      console.log(arr);
          
    })
  }
  onTransRowSelect(i:number){
    this.disableDetails=false;
    this.selectedTransRow=i;
  }

}
