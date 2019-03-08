import { CurrencyPipe } from '@angular/common';
import { window } from 'rxjs/internal/operators';
import { Component, OnInit, OnChanges,TemplateRef } from '@angular/core';
import { Property, Transactions, TransactionPhase } from '../model';
import { FromToServiceService } from './../from-to-service.service';
import { BlockchainService } from '../blockchain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { resolve, reject } from 'q';
import { Helper } from '../helper';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Title } from '@angular/platform-browser';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.css']
})
export class BuyerDashboardComponent implements OnInit {
  public helper: Helper;
  public disableFlag = true;
  public disableContinue = true;
  public disableDetails = true;
  //public pp=properties;
  public pp: Property[];
  public cpp: Property[];
  public transactions: Transactions[];
  public selectedRow: number;
  public selectedTransRow: number;
  token;
  public img1:any
  public img2:any
  public img3:any
  public img4:any
  public img1lbl
  public img2lbl
  public img3lbl
  public img4lbl
  public pTitle
  public pAddr
  public pPrice
  public pDesc


//*************ProgressBar Variables***************/
public SA = false
public LApl= false
public LApr= false
public PtoE= false
public ERecT= false
public MC= false
public MR= false
public LAmtR= false
public SP= false
public BrecT= false

//***********************/

  title : String
  location: String
  price: Number
  mob: Number
  public ls: number;
  public prog = true;
modalRef: BsModalRef;
config = {
  animated: true
};
  public selectedTpRow:number;

  constructor(private socketService: SocketService,private modalService: BsModalService,private titleService:Title,private _fromToService: FromToServiceService, private _myService: BlockchainService, private router: Router, private route: ActivatedRoute) {
    this.helper = new Helper(socketService,_fromToService, _myService)
  }

  ngOnInit() {
    this.titleService.setTitle('Buyer');
    this._fromToService.enroll().subscribe(data => {
      this.token = data.token;
      this.helper.setToken(data.token);
      //this.checkStatus();
      this.getAllTids().then(() => {


      }).catch(e => {
        console.log('Encountered error while retrieving transaction ids');

      })
      this.getAllTps();
      this.getProperties();

    });
    document.body.classList.remove('bg-img');


  }
  //*******************TP TABLE********** */
  async getAllTps(){
    await this._fromToService.getAllTps(this.helper.getToken()).subscribe(data=>{
      this.helper.tps=data;
    })
  }
  onTpRowSelect(i: number) {
    this.selectedTpRow = i;
     this.disableContinue = false;
    
  }
  getTransStatus(i:number){
    return this.helper.getTransStatus(i);
  
  }
  

  onContinue() {
    let property = this.helper.tps[this.selectedTpRow].property;
    this.router.navigate([property._id], { relativeTo: this.route })
    
  }

  //************************************************* */
   

  //****************TID TABLE***** */
  async getAllTids() {
    await this._fromToService.getAllTid(this.helper.getToken()).subscribe(data => {
      this.transactions = data;
    })

  }
  toDate(t) {
    return this.helper.toDate(t);
  }
  onDetails() {
    let trans = this.transactions[this.selectedTransRow];
    console.log(trans.tId);
    this.helper.viewByTid(trans.tId)
  }
  onTransRowSelect(i: number) {
    this.disableDetails = false;
    this.selectedTransRow = i;
  }
  //************************************************* */


  remvProgBar(): void {
    this.prog = false;
  }

  addProgBar(): void {
    this.prog = true;
  }


  // checkStatus() {
  //   // this.ls=parseInt(localStorage.getItem('trans_Stage$'));
  //   this._fromToService.getTp(this.token).subscribe(data => {
  //     this.ls = data.tp;

  //   });
  // }
  updateLs(trp:TransactionPhase) {
    return new Promise((resolve, reject) => {
      this._fromToService.updateTp(trp, this.token).subscribe(data => {
        this.ls = data.tp;
        resolve();
      })
    })

  }
  async getProperties() {
    // this._myService.properties.subscribe(data=>{
    //   this.pp=data;
    // });
    await this._fromToService.getAllProp(this.helper.getToken()).subscribe(props => {
      this.pp = props;
    })
  }

  onRowSelect(i: number) {
    this.disableFlag = false;
    this.selectedRow = i
  }
  
  onBuy() {
    let property = this.pp[this.selectedRow];
    let trp={
      _id:'',
      tp:1,
      property
    }
    this.updateLs(trp).then(() => {
      this.router.navigate([property._id], { relativeTo: this.route })
    });

    // localStorage.setItem('trans_Stage$','1');

  }

  onView(){
    let property = this.pp[this.selectedRow];
    // console.log(property);
    
    if(this.selectedRow==1){
      this.img1 = "/assets/image/01.JPG"
      this.img2 = "/assets/image/02.JPG"
      this.img3 = "/assets/image/03.JPG"
      this.img4 = "/assets/image/04.JPG"
      this.img1lbl = 'Front View'
      this.img2lbl = 'Fire Place'
      this.img3lbl = 'Kitchen'
      this.img4lbl = 'Backyard'
      this.pAddr = '3 Edgar Buildings, George Street, Bath, England, BA1 2FJ'
      this.pDesc =  "You won't want to miss out on this 'modern' STUDIO APARTMENT situated in Birmingham City Centre! The property comprises of OPEN LIVING SPACE, LOUNGE, FITTED KITCHEN, shower room, and double glazing. Thanks to it sought after location it's a stone throw away from a variety of educational facilities and convenient day to day amenities such as: Birmingham Metropolitan College, Bullring Shopping Centre, Tesco Express Supermarket, New Street Train Station, and M6/A38 (Junction 6). EPC Rating : TBC. RESERVATION FEES APPLY!!!"
      this.pPrice = property.price
      this.pTitle = '1 bedroom flat for sale'
    }else{
      this.img1 = "/assets/image/11.JPG"
      this.img2 = "/assets/image/12.JPG"
      this.img3 = "/assets/image/13.JPG"
      this.img4 = "/assets/image/14.JPG"
      this.img1lbl = 'Front View'
      this.img2lbl = 'Garage / Parking'
      this.img3lbl = 'Backyard'
      this.img4lbl = 'Floor Plan'
      this.pAddr = property.location
      this.pDesc =  "Davidson Estates are delighted to present this rare opportunity to buy a property with planning permission for a 12,303 square foot new build mansion on the beautiful Calthorpe Estate in Edgbaston.Located in the highly desirable suburb of Birmingham City Centre, the site has planning permission to build an executive mansion spanning 12,303 square foot of internal space, over four floors and with a south east facing garden. The total plot size is 0.8 of an acre.The owner has had positive conversations with the planning office regarding further planning permission for a leisure centre including a swimming pool, Jacuzzi and gym scaling at circa. 3,000 square foot over two floors."
      this.pPrice = property.price
      this.pTitle = property.title
    }
    
  }

}
