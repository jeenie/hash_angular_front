import { Component, Input, OnInit } from '@angular/core';
import { bankUserBalanceHistoryVO } from 'src/app/model/bankUserBalanceHistoryVO';
import { RestfulService } from '../../service/restful.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-withdraw-edit',
  templateUrl: './withdraw-edit.component.html',
  styleUrls: ['./withdraw-edit.component.css'],
  providers: [RestfulService]
})
export class WithdrawEditComponent implements OnInit {

  
 /****   DATA BINDING ****/

 @Input()
 wallet_id:any = "";
 @Input()
 edit_form={
   wallet_id:"",
   amount:0,
   reg_date:"",
   new_date:""
 }
 preview_balance = 0;

 depositInfo: bankUserBalanceHistoryVO ={
 
   WALLET_HISTORY_SEQ:0,
   WALLET_ID:"",
   USER_ID	:"",
   GUBUN:"",
   SORT:0,
   COIN_ID:"",
   AMOUNT:0,
   BALANCE:0,
   REASON:"",
   REASON_DETAIL:"",	
   REG_DATE:"",
   REG_USER:"",	
   UP_DATE:"",
   UP_USER:"",
   USE_FLAG:"",
 
 } 
 bankUserBalance:bankUserBalanceHistoryVO[] =[];


  constructor(private restfulService: RestfulService,private router: Router) { 
  }

  ngOnInit(): void {
    this.getUserBalance();
    

  }


  /*******   get User Balance   *******/
  getUserBalance(){
    this.restfulService.httpGet("bank_user_balance_history").subscribe(Response=>{

      const temp:any = Response;
      console.log(temp);
      this.bankUserBalance = temp['edu_bank_user_balance_historyList']['Row'];

      for(let i=0; i< this.bankUserBalance.length; i++){
        if(this.bankUserBalance[i].USER_ID == "abulfayz7"){
          this.depositInfo.WALLET_ID = this.bankUserBalance[i].WALLET_ID;
          //for edit
          this.edit_form.wallet_id = this.bankUserBalance[i].WALLET_ID;
          this.depositInfo.GUBUN = this.bankUserBalance[i].GUBUN;
          this.depositInfo.COIN_ID=this.bankUserBalance[i].COIN_ID;
          this.depositInfo.AMOUNT = this.bankUserBalance[i].AMOUNT;
          //for edit
          this.edit_form.amount =  this.bankUserBalance[i].AMOUNT;
          this.depositInfo.BALANCE = this.bankUserBalance[i].BALANCE;
          this.depositInfo.REASON = this.bankUserBalance[i].REASON;
          this.depositInfo.REASON_DETAIL = this.bankUserBalance[i].REASON_DETAIL;
          this.depositInfo.REG_DATE = this.bankUserBalance[i].REG_DATE;
          //for edit
          this.edit_form.reg_date = this.bankUserBalance[i].REG_DATE;
          break;
        }
      }
     
    })

  }

  editHistory(){
    this.edit_form.new_date = this.getTimeStamp();
    this.restfulService.httpPut("bank_user_balance_history/withdrawal",this.edit_form).subscribe(Response=>{
     

    });
    if( this.depositInfo.GUBUN == "I"){
      this.depositInfo.BALANCE = Number(this.depositInfo.BALANCE) - Number(this.depositInfo.AMOUNT) + Number(this.edit_form.amount);
    }else if(this.depositInfo.GUBUN == "O"){
      this.depositInfo.BALANCE = Number(this.depositInfo.BALANCE) + Number(this.depositInfo.AMOUNT) - Number(this.edit_form.amount);
    }
    
    this.depositInfo.WALLET_ID = this.edit_form.wallet_id;
    this.depositInfo.AMOUNT = this.edit_form.amount;
    this.depositInfo.REG_DATE = this.edit_form.new_date
    alert("수정을 완료하였습니다.")

    }
    undoHistory(){
      this.restfulService.httpDelete('bank_user_balance_history/undo').subscribe(Response=>{});
      alert("취소를 완료하였습니다.")
      this.router.navigateByUrl('/com/check-exchange')

    }



  /***  get now DATE ****/
  getTimeStamp(){
    var d = new Date();
    var s = this.leadingZeros(d.getFullYear(), 4) + '-'+
            this.leadingZeros(d.getMonth() + 1, 2) + '-' +
            this.leadingZeros(d.getDate(), 2) + ' ' +

            this.leadingZeros(d.getHours(), 2) + ':' +
            this.leadingZeros(d.getMinutes(), 2) + ':' +
            this.leadingZeros(d.getSeconds(), 2);
    return s;


  }


   leadingZeros(n:any, digits:any) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
  

}
