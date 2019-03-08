import { Router } from '@angular/router';
import { BlockchainService } from '../blockchain.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';


declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username='';
  public password='';
  public errorFlag=false;

  constructor(private titleService:Title,private _myService:BlockchainService,private router:Router){

  }
  ngOnInit() {
    this.titleService.setTitle('Login');
    this.errorFlag=false;
    // document.body.classList.add('bg-img');
    $('#login-form-link').click(function(e) {
      this.errorFlag=false;
      $("#login-form").delay(100).fadeIn(100);
       $("#register-form").fadeOut(100);
      $('#register-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
      this.errorFlag=false;
      $("#register-form").delay(100).fadeIn(100);
       $("#login-form").fadeOut(100);
      $('#login-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
  }
  onLogin(){
    
    let page=this._myService.loginService({'username':this.username,'password':this.password})
    if(page==='buyer'){
      this.router.navigate(['/buyer']);
    }else if(page==='seller'){
      this.router.navigate(['/seller']);
    }else if(page==='bank'){
      this.router.navigate(['/bank']);
    }else if(page==='escrow'){
      this.router.navigate(['/escrow']);
    }else if(page==='wrong input'){
      this.errorFlag=true;
    }
    
  }
  onInputChange(){
    
    this.errorFlag=false;
  }
  checkDisable(){
    if(this.username=='' || this.password==''){
      return true;
    }else{
      return false;
    }
  }


}
