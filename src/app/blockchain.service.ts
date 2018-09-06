import { Observable } from 'rxjs/internal/Rx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Property } from './model';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  constructor(private http:HttpClient) { }

  // public properties:BehaviorSubject<Property[]> = new BehaviorSubject([
  //   {
  //     _id:'1',
  //     title:'ITC Infotech',
  //     location:'Bangalore',
  //     price:500000,
  //     contact:8436690126
  // },
  // {
  //     _id:'2',
  //     title:'Sayak home',
  //     location:'Kolkata',
  //     price:9000000,
  //     contact:8436690126
  // }
  // ]);

  // setFalse(){

  //   this.sharedData.next(false);
  // }

  // setTrue(){
    
  //       this.sharedData.next(true);
  //     }
  loginService(logindetail:Object){
     let username=logindetail['username'];
     let password=logindetail['password'];
     if(username==='buyer'&&password==='buyer')
     {
       return 'buyer';
     }
     else if(username==='seller'&&password==='seller')
     {
       return 'seller';
     }
     else if(username==='bank'&&password==='bank')
     {
       return 'bank';
     }
     else if(username==='escrow'&&password==='escrow')
     {
       return 'escrow';
     }
     else{
       return 'wrong input';
     }
  }
  // public getProperties(): Observable<Property[]> {
  //   return this.http.get<Property[]>("./assets/json/properties.json")
  // }
  
  // deleteProperty(property:Property,pp:Property[]){
  //   this.properties.next(pp.filter((prop)=>prop.title!=property.title)) ;


  // }
  // addProperty(property:Property,pp:Property[]){
  //   pp.push(property);

  //   this.properties.next(pp);
  // }
  
}
