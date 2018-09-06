import { BlockchainService } from '../blockchain.service';
import { Component, OnInit } from '@angular/core';
import { BT } from '../model';

@Component({
  selector: 'app-balance-transfer',
  templateUrl: './balance-transfer.component.html',
  styleUrls: ['./balance-transfer.component.css']
})
export class BalanceTransferComponent implements OnInit {
  model:BT=new BT("","",0);
  public users=["Buyer","Seller","Bank","Escrow"];
  public fromUsers=["Buyer","Seller","Bank","Escrow"];
  public toUsers=["Buyer","Seller","Bank","Escrow"];
  public message="";
  public tempAmount=0;
  public senderBalance=40000;
  public recieverBalance=40000;
  public oldSenderBalance=0;
  public oldRecieverBalance=0;
  public showDetails=false;
  public d =true;
  constructor(private service:BlockchainService) { }

  ngOnInit() {
    document.body.classList.remove('bg-img');
  }
  eliminateFromUser()
  {
    
    this.fromUsers=this.users.filter((user)=>user!==this.model.to);
  }
  eliminateToUser()
  {
    
    this.toUsers=this.users.filter((user)=>user!==this.model.from);
    if(this.toUsers.length==1)
    {
      this.model.to=this.toUsers[0];
    }
  }
  submitState()
  {
    if(this.model.from ==="" || this.model.to ==="" || this.model.amount===null || this.model.amount===0 )
    {
     
      return true;
    }
    else{
      return false;
    }
  }

  onSubmit(){
    //this.service.setFalse();
  }
}
