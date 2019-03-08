import { BlockchainService } from './blockchain.service';
import * as CryptoJS from 'crypto-js';

import { Property, Transactions, TransactionPhase } from './model';
import { FromToServiceService } from './from-to-service.service';
import { resolve, reject } from 'q';
import { SocketService } from './socket.service';
import { formatCurrency } from '@angular/common';
export class Helper {
  constructor(private socketService: SocketService,private _fromToService: FromToServiceService, private service: BlockchainService) {

    // service.sharedData.subscribe( data => {

    //   console.log(data)
    //   this.EA = data;
    // })
  }
  // public loan_tid: String = 'Loan_Amount';
  // public full_amnt_tid: String = 'Full_Amount';
  // public ten_amnt_tid: String = 'Ten_Amount';
  public amount_tid: String = 'Amount';
  public mortgage_tid: String = 'Mortgage';
  public title_tid: String = "Title";
  public title_rec_tid: String = "TitleRecord";

  jovin = [];
  abc = false;
  def = true;
  fileToDigest: File = null;
  a;
  key = CryptoJS.enc.Utf8.parse('7061737323313233');
  iv = CryptoJS.enc.Utf8.parse('7061737323313233');
  token;
  public ls: Number;
  public property: Property;

  public tps:TransactionPhase[];

  setProperty(property: Property) {
    this.property = property;
  }
  getProperty() {
    return this.property;
  }
  getAmount_tid() {
    return this.amount_tid;
  }

  getMortgage_tid() {
    return this.mortgage_tid;
  }
  getTitle_tid() {
    return this.title_tid;
  }
  getTitle_rec_tid() {
    return this.title_rec_tid
  }



  getTransState() {
    return this.ls;
  }
  setToken(token) {
    this.token = token;

  }
  getToken() {
    return this.token;

  }
  getTid(tType, callback) {
    // this.ls=parseInt(localStorage.getItem('trans_Stage$'));

    this._fromToService.getTid(tType, this.token).subscribe(data => {
      // this.tid= data.tId;
      callback(data.tId);

    });
  }
  async viewByTid(tid) {
    var data;
    await this._fromToService.view(tid, this.token).subscribe(data => {
      data = data;
    });
    return await data;
  }
  updateTid(trans: Transactions) {
    this._fromToService.updateTid(trans, this.token).subscribe(data => {
      return data.tId;
    })
  }
  checkStatus() {
    // this.ls=parseInt(localStorage.getItem('trans_Stage$'));

    this._fromToService.getTp(this.property._id, this.token).subscribe(data => {
      this.ls = data.tp;

      //callback(data.tp);

    });
  }
  updateLs(trp: TransactionPhase) {
    this._fromToService.updateTp(trp, this.token).subscribe(data => {
      this.ls = data.tp;

    })
  }

  decrypt(data) {
    var decrypted = CryptoJS.AES.decrypt(data, this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return decrypted;
  }
  encrypt(b64data) {
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(b64data), this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return String(encrypted);
  }
  //****************VIEW DOCUMENT***************** */
  checkTid(docType, callback) {
    var tnx_id;
    if (docType == "title") {
      // tnx_id = "TUpTxn_id"
      this.getTid(this.title_tid, ntid => {
        tnx_id = ntid
        callback(tnx_id);
      })
    }
    else if (docType == "titleRecord") {
      // tnx_id = "TRUpTxn_id"
      this.getTid(this.title_rec_tid, ntid => {
        tnx_id = ntid
        callback(tnx_id);
      });
    }
    else if (docType == "mortgage") {
      // tnx_id = "MUpTxn_id"
      this.getTid(this.mortgage_tid, ntid => {
        tnx_id = ntid
        callback(tnx_id);
      });
    }


  }
  view(docType) {
    this.checkTid(docType, (tnx_id) => {
      this._fromToService.view(tnx_id, this.token).subscribe(data => {
        var date = new Date()//.toLocaleDateString();
        var arr = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes;
        var currentOwner = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[0];
        if (arr.length == 2) {
          var hashedFile = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[1].value;
          alert("\t\t\tOwnership Record\n\n\t\t\tOn Ledger As Of --> \n\n\t" + date + "\n\n\t" + currentOwner.key + " \t:\t " + currentOwner.value + "\t");
        }
        else if (arr.length == 3) {
          if (docType == "mortgage") {
            var hashedFile = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[1].value;
            var prevOwner = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[2];

          } else {
            var prevOwner = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[1];
            var hashedFile = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[2].value;


          }
          if(docType!='titleRecord')
          alert("\t\t\tOwnership Record\n\n\t\t\tOn Ledger As Of --> \n\n\t" + date + "\n\n\t" + currentOwner.key + ":\t" + currentOwner.value + "\t\n\n\t" + prevOwner.key + ":\t" + prevOwner.value + "\t");
        }
        var dec = this.decrypt(hashedFile).toString(CryptoJS.enc.Utf8);
        var b = atob(dec);
        let byteNumbers = new Array(b.length);
        for (var i = 0; i < b.length; i++)
          byteNumbers[i] = b.charCodeAt(i);

        let byteArray = new Uint8Array(byteNumbers);

        let blob = new Blob([byteArray], { type: 'text/plain' });

        window.open(window.URL.createObjectURL(blob), "_blank");
      });
    });
  }


  //*********TRANSFER ANY TYPE OF TITLE************ */
  move(from, to, tType, ls) {
    this._fromToService.movedoc(from, to, tType, this.token).subscribe(data => {
      let description = "Transfered " + tType + " to " + to;
      let user = from;
      let tId = data.TransactionID;
      let trans = {
        tType,
        tId,
        user,
        description,
        createdAt: 0,
        property: this.property
      }

      this.updateTid(trans);
      var str = 'Trasaction Details';
      var date = new Date()//.toLocaleDateString();
      alert("\t\t\t\t\t    " + str + "\n" + "\n\t\t\t\t\tTransaction Successful!\n\n\t\t\tSuccessfully Transfered " + tType + " to " + to + "\n\n\t\tOn   :  " + date + "\n\n\t\t\t\t\t     Transaction id is :\n\n" + data.TransactionID);
      //alert("Successfully Transfered " + tType + " to " + to + "\nTransaction ID : " + data.TransactionID);
      // localStorage.setItem('trans_Stage$',ls);
      // this.checkStatus();
      let trp = {
        _id: '',
        tp: ls,
        property: this.property
      }
      this.updateLs(trp);
    });
  }

  //*********TRANSFER ANY AMOUNT************ */
  moveAmount(from, to, aType, ls) {
    let am=0;
    if(aType=='Ten Percent'){
      am=this.property.price * 0.1;
    }else if(aType=='LOAN'){
      am=this.property.price * 0.9;
   }else if(aType=='FULL'){
    am=this.property.price;
    }
    let amount=am.toString();
    let description = "Transfered " + amount + "Rs " + aType + " amount to " + to;
    let user = from;

    this._fromToService.moveAmount(from, to, amount, this.token).subscribe(data => {
      // localStorage.setItem('FullTrns_id', data.TransactionID);
      let tId = data.TransactionID;
      let trans = {
        tType: this.amount_tid,
        tId,
        user,
        description,
        createdAt: 0,
        property: this.property
      }
      this.updateTid(trans);
      var str = 'Trasaction Details';
      var date  = new Date()//.toLocaleDateString();
      let c_amount=formatCurrency(am, "en-US",'£', "GBP", '1.0-2');
      alert("\t\t\t\t\t\t"+str+"\n"+"\n\t\t\t\t\t   Transaction Successful!\n\n\t\t\t  Successfully Transferred " + c_amount + " to " + to +"\n\n\t\tOn   :  "+date+"\n\n\t\t\t\t\t\tTransaction id is :\n\n" + data.TransactionID);
      //alert("Successfully Transferred " + amount + " to " + to + "\nTransaction ID : " + data.TransactionID);
      // localStorage.setItem('trans_Stage$','9');
      // this.checkStatus();
      let trp = {
        _id: '',
        tp: ls,
        property: this.property
      }
      this.updateLs(trp);
    });
  }
  // ******************************************UPLOADING AND ECRYPTING******
  //*********UPLOAD TITLE************ */
  async titleUp(files: FileList) {
    this.fileToDigest = files.item(0);
    if (files && this.fileToDigest) {
      var reader = new FileReader();
      reader.onload = this.handleReaderLoadedT.bind(this);
      reader.readAsBinaryString(this.fileToDigest);
    }
  }
  async handleReaderLoadedT(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.a = btoa(binaryString);
    console.log(this.a);
    let enc = await this.encrypt(this.a);
    if (enc != null) {
      var docType = "Title";
      var user = "Seller"
      let tType = this.title_tid;
      let description = tType + ' Uploaded by ' + user;
      this._fromToService.upload(enc, docType, user, this.token).subscribe((data) => {
        var date = new Date()//.toLocaleDateString();
        var str = 'Trasaction Details';
        alert("\t\t\t\t\t\t" + str + "\n" + "\n\t\t\tSuccessfully uploaded Title to BlockChain ledger\n\n\t\t   On   :  " + date + "\n\n\t\t\t\t\t\tTransaction id is :\n\n" + data.message);
        let tId = data.message;
        let trans = {
          tType,
          tId,
          user,
          description,
          createdAt: 0,
          property: this.property
        }
        this.updateTid(trans);
      });
    } else {
      console.log('no data found');
    }


  }

  //*********UPLOAD RECORD************ */
  async titleRecordUp(files: FileList) {
    this.fileToDigest = files.item(0);
    if (files && this.fileToDigest) {
      var reader = new FileReader();
      reader.onload = this.handleReaderLoadedTR.bind(this);
      reader.readAsBinaryString(this.fileToDigest);
    }

  }

  async handleReaderLoadedTR(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.a = btoa(binaryString);
    let enc = await this.encrypt(this.a);
    if (enc != null) {
      var docType = "TitleRecord";
      var user = "Seller"
      let tType = this.title_rec_tid;
      let description = tType + ' Uploaded by ' + user;
      this._fromToService.upload(enc, docType, user, this.token).subscribe(data => {
        var date = new Date()//.toLocaleDateString();
        var str = 'Trasaction Details';
        alert("\t\t\t\t\t\t" + str + "\n" + "\n\t\t\tSuccessfully uploaded Title-Record to BlockChain ledger\n\n\t\t   On   :  " + date + "\n\n\t\t\t\t\t\tTransaction id is :\n\n" + data.message);
        // localStorage.setItem('TRUpTxn_id', data.message);
        let tId = data.message;
        let trans = {
          tType,
          tId,
          user,
          description,
          createdAt: 0,
          property: this.property
        }
        this.updateTid(trans);
      });
    } else {
      console.log('no data found');
    }


  }
  //**************UPLOADING MORTGAGE************************* */
  async mortgageUp(files: FileList) {
    this.fileToDigest = files.item(0);
    if (files && this.fileToDigest) {
      var reader = new FileReader();
      reader.onload = this.handleReaderLoadedM.bind(this);
      reader.readAsBinaryString(this.fileToDigest);
    }
  }

  async handleReaderLoadedM(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.a = btoa(binaryString);


    let enc = await this.encrypt(this.a);
    if (enc != null) {
      var docType = "Mortgage";
      var user = "Bank"
      let tType = this.mortgage_tid;
      let description = tType + ' Uploaded by ' + user;
      this._fromToService.upload(enc, docType, user, this.token).subscribe(data => {
        var date = new Date()//.toLocaleDateString();
        var str = 'Trasaction Details';
        alert("\t\t\t\t\t\t" + str + "\n" + "\n\t\tSuccessfully uploaded Mortgage to BlockChain ledger\n\n\t\t   On   :  " + date + "\n\n\t\t\t\t\t\tTransaction id is :\n\n" + data.message);
        let tId = data.message;
        let trans = {
          tType,
          tId,
          user,
          description,
          createdAt: 0,
          property: this.property
        }
        this.updateTid(trans);
      });
    } else { console.log('no data found') }


  }
  //****************TID TABLE***** */

toDate(t){
  return new Date(t).toUTCString();
}
//************TP TABLE *******/
getTransStatus(i:number){
  switch(i){
    case 1:
      return "Seller Notified"
    case 2:
      return "Purchase & Sale agreement Signed"
    case 3:
      return "Loan Application Received"
    case 4:
      return "Loan Approved"
    case 5: 
      return "Payment to Escrow"
    case 6:
      return "Escrow Recieved Title"
    case 7:
      return "Mortgage Recieved"
    case 8:
      return "Loan Amount Recieved"
    case 9:
      return "Seller Paid"
    case 10:
      return "Bank Recieved Title"
    case 11:
      return "Transaction Completed"
  }
}
//****************PROGRESS BAR TOGGLES******* */
  //*******PROG BAR TOGGLES******* */
  public SN() {
    if (this.ls >= 1) {
      return true;
    } else {
      return false;
    }
  }
  public SApp() {
    if (this.ls >= 2) {

      return true;
    } else {
      return false;
    }
  }
  public LApl() {
    if (this.ls >= 3) {
      return true;
    } else {
      return false;
    }
  }
  public LApr() {
    if (this.ls >= 4) {
      return true;
    } else {
      return false;
    }
  }
  public PtoE() {
    if (this.ls >= 5) {
      return true;
    } else {
      false;
    }
  }
  public ERecT() {
    if (this.ls >= 6) {
      return true;
    } else {
      return false;
    }
  }
  public MC() {
    if (this.ls >= 7) {
      return true;
    } else {
      return false;
    }
  }
  public MR() {
    if (this.ls >= 7) {
      return true;
    } else {
      return false;
    }
  }
  public LAmtR() {
    if (this.ls >= 8) {
      return true;
    } else {
      return false;
    }
  }
  public SP() {
    if (this.ls >= 9) {
      return true;
    } else {
      return false;
    }
  }
  public BrecT() {
    if (this.ls >= 9) {
      return true;
    } else {
      return false;
    }
  }
  //****************SOCKET**************** */
  public initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onTp()
      .subscribe((tp) => {
        //console.log("******FROM HELPER ",tp);
        this.ls=tp.tp;
        
    });
    this.socketService.onTps()
      .subscribe((data) => {
        //console.log("******FROM HELPER ",data);
        this.tps=data
        
    });

  }
  
  
}



