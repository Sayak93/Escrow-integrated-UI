import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpParams , HttpHeaders} from '@angular/common/http';
import { Transactions, Property, TransactionPhase } from './model';


@Injectable()
export class FromToServiceService {
  // _Url='http://192.168.43.226:4000/';
  _Url='http://localhost:4000/';
  usr1='HDFC';
  usr2='ICICI';
  username='jovin_is_God';
  orgname='Org1';
  enrl='username='+this.username+'&orgName='+this.orgname;
  setup = 'api=setup';
  chCr = {
    "channelName":"mychannel",
    "channelConfigPath":"../artifacts/channel/mychannel.tx"
  };

  jCh={
    "peers": ["peer0.org1.example.com","peer1.org1.example.com"]
  };

  instChCo={
  "peers": ["peer0.org1.example.com","peer1.org1.example.com"],
	"chaincodeName":"mycc",
	"chaincodePath":"github.com/example_cc/go",
	"chaincodeType": "golang",
	"chaincodeVersion":"v0"    
  };

  instantiateChCo={
    "peers": ["peer0.org1.example.com","peer1.org1.example.com"],
    "chaincodeName":"mycc",
    "chaincodeVersion":"v0",
    "chaincodeType": "golang",
    "args":[this.usr1,"100000",this.usr2,"200000"]
  }

  constructor(private http:HttpClient) { }
  //**************SERVICE TRANSACTION ID********* */
  getTid(tType,token){
    return this.http.get<any>(this._Url+'tid/'+tType,{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }
  updateTid(trans:Transactions,token){
    return this.http.post<any>(this._Url+'tid',trans,{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
    
  }
  getAllTid(token):Observable<Transactions[]>{
    return this.http.get<Transactions[]>(this._Url+'tids',{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }
  //******************TRANSACTION PHASE******** */
  getTp(property,token){
    //let property='5b45fad292f9dc26a5a47f6f';
    return this.http.get<any>(this._Url+'tp/'+property,{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }
  getAllTps(token):Observable<TransactionPhase[]>{
    return this.http.get<TransactionPhase[]>(this._Url+'tp',{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }

  updateTp(trp:TransactionPhase,token){
    
    return this.http.post<any>(this._Url+'tp',trp,{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
    
  }
  //***************PROPERTY SERVICE****** */
  deleteProp(id,token):Observable<Property>{
    return this.http.delete<Property>(this._Url+'property/'+id,{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }
  addProp(prop:Property,token):Observable<Property>{
    return this.http.post<Property>(this._Url+'property',{prop},{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }
  getAllProp(token):Observable<Property[]>{
    return this.http.get<Property[]>(this._Url+'properties',{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }
  getProp(id,token):Observable<Property>{
    return this.http.get<Property>(this._Url+'property/'+id,{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }
  

  enroll(){
    return this.http.post<any>(this._Url+"setup" ,this.setup,{headers:{'Content-Type':'application/x-www-form-urlencoded'}});
  }

  view(txn_id, token){
    return this.http.get<any>(this._Url+"channels/mychannel/transactions/"+txn_id+"?peer=peer0.org1.example.com",{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });


  }

  upload(encdata, dType, user, token){
    token = token;
    let docType = dType;
    let usr = user;
    let encrypteddocType = encdata;
    let body  ={
      "peers": ["peer0.org1.example.com","peer1.org1.example.com"],
      "fcn":"add",
      "args": [encrypteddocType,dType,usr]     
    };
    return this.http.post<any>(this._Url+"upload",body,{
      headers:{'Content-Type':'application/json', 'authorization':'Bearer'+" "+ token}
    });
  }

  movedoc(from, to, type, token)
  {
    let body={
      "peers": ["peer0.org1.example.com","peer1.org1.example.com"],
      "fcn":"transfer",
      "args":[from, to, type]
    }
    return this.http.post<any>(this._Url+"channels/mychannel/chaincodes/mycc",body,{
      headers:{'Content-Type':'application/json','authorization':'Bearer'+" "+ token}
  });
  }
  moveAmount(from,to,amount,token)
  {
    let body={
      "peers": ["peer0.org1.example.com","peer1.org1.example.com"],
      "fcn":"move",
      "args":[from, to, amount]
    }
    return this.http.post<any>(this._Url+"channels/mychannel/chaincodes/mycc",body,{
      headers:{'Content-Type':'application/json','authorization':'Bearer'+" "+ token}
  });
  }

  createChannelReq(){
    let x =localStorage.getItem('token');
    return this.http.post<any>(this._Url+"channels" ,this.chCr,{headers:{'Content-Type':'application/json', 'authorization':'Bearer ' + x}});
  }

  joinChannelReq(){
    return this.http.post<any>(this._Url+"channels/mychannel/peers" ,this.jCh,{headers:{'Content-Type':'application/json', 'authorization':'Bearer ' + localStorage.getItem('token')}});
  }

  instChainCode(){
    return this.http.post<any>(this._Url+"chaincodes" ,this.instChCo,{headers:{'Content-Type':'application/json', 'authorization':'Bearer ' + localStorage.getItem('token')}});
  }

  instantiateChainCode(){ 
    return this.http.post<any>(this._Url+"channels/mychannel/chaincodes" ,this.instantiateChCo,{headers:{'Content-Type':'application/json', 'authorization':'Bearer ' + localStorage.getItem('token')}})
    .timeout(20000);
    //return this.http.post<any>(this._Url+"channels/mychannel/chaincodes" ,this.instantiateChCo,{headers:new HttpHeaders({ timeout: `${20000}`,'Content-Type':'application/json', 'authorization':'Bearer ' + localStorage.getItem('token') })});
  }

  

}
