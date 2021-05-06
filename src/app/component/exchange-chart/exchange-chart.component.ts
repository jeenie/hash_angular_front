import { Component, Input, OnInit } from '@angular/core';
import { bankUserBalanceHistoryVO } from 'src/app/model/bankUserBalanceHistoryVO';
import{ HSSquoteVO } from 'src/app/model/HSSquoteVO';
import { RestfulService } from '../../service/restful.service';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, } from 'ng2-charts';
import { faCoins} from '@fortawesome/free-solid-svg-icons';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { textChangeRangeIsUnchanged } from 'typescript';
import { bankUserInfoVO } from '../marcketing-dash/bankUserInfoVO';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-exchange-chart',
  templateUrl: './exchange-chart.component.html',
  styleUrls: ['./exchange-chart.component.css'],
  providers: [RestfulService]
})
export class ExchangeChartComponent implements OnInit {
  

  faCoins = faCoins;
  /******  LINECHART_INFO ******/
  @Input()
  private HSS_USDT_PRICE:any=[];
  @Input()
  private REG_DATE:any=[];


  // Array of different segments in chart
  lineChartData: ChartDataSets[] = [
    { data: this.HSS_USDT_PRICE  , label: 'HSS 시세' }
  ];

  //Labels shown on the x-axis
  lineChartLabels: Label[] = this.REG_DATE;

  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true
  };

  // Define colors of chart segments
  lineChartColors: Color[] = [

    { // dark grey
      backgroundColor: 'rgba(61,170,243,0.5)',
      borderColor: 'rgba(22,62,11,0.5)',
    },
  ];

  // Set true to show legends
  lineChartLegend = true;

  // Define type of chart
  lineChartType = 'line' as const;

  lineChartPlugins = [];

  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


   /******  PIECHART_INFO ******/
   private pieData: any=[];
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        // label: function (tooltipItems, data) {
        //   return data.datasets[0].data[tooltipItems.index] + ' %';
        // }
      }
    },
  };

  pieChartLabels: Label[] = ['입금', '출금'];

  pieChartData: number[] = this.pieData;

  pieChartType: ChartType = 'pie';

  pieChartLegend = true;

  pieChartPlugins = [];

  pieChartColors = [
    {
      backgroundColor: ['rgba(0, 149, 108, 0.3)', 'rgba(255,0,0,0.3)' ],
    },
  ];

 /****   DATA BINDING ****/
  date={
    start_date:'',
    end_date:''
  }
  wallet_id:any = "";
  amount:number = 0;
  balance:number=0;
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
    this.getHSSquoteData();
    this.getUserBalance();
  }

  /******    get HSSquote & input data in LineChart    *******/  
  getHSSquoteData(){

    this.restfulService.httpGet("HSSquote").subscribe(Response=>{
      let HSSquote:Array<HSSquoteVO> = new Array<HSSquoteVO>();
      const temp:any = Response;
      HSSquote = temp['HSSquoteList']['Row'];
      for(let i=0; i<HSSquote.length; i++){

            this.HSS_USDT_PRICE.push(HSSquote[i].USDT_PRICE);
            this.REG_DATE.push(HSSquote[i].REG_DATE);
      }  
      this.HSS_USDT_PRICE.reverse();
      this.REG_DATE.reverse();   

    });
    
  }
   
  /*******   get User Balance   *******/
    getUserBalance(){
    this.restfulService.httpGet("bank_user_balance_history").subscribe(Response=>{
      // let bankUserBalance:bankUserBalanceHistoryVO[] = [];
      

      let sumDeposit:number = 0;
      let sumWithDraw:number =0;
      const temp:any = Response;
      console.log(temp);
      this.bankUserBalance = temp['edu_bank_user_balance_historyList']['Row'];


      
      for(let i=0; i< this.bankUserBalance.length; i++){
        if(this.bankUserBalance[i].USER_ID == "abulfayz7" ){
            if(this.bankUserBalance[i].GUBUN == "I"){
              sumDeposit+=Number(this.bankUserBalance[i].AMOUNT);
            }
            else if(this.bankUserBalance[i].GUBUN == "O"){
              sumWithDraw+=Number(this.bankUserBalance[i].AMOUNT);
            }
        }     
      }

      
      for(let i=0; i< this.bankUserBalance.length; i++){
        if(this.bankUserBalance[i].USER_ID == "abulfayz7"){

          //********PIE DATA*/
          this.pieData.push(sumDeposit);
          this.pieData.push(sumWithDraw);
          console.log(this.pieData);

          this.wallet_id = this.bankUserBalance[i].WALLET_ID;
          this.balance = this.bankUserBalance[i].BALANCE;
          // let temp:number = Number(bankUserBalance.length) -2;
          // this.depositInfo.WALLET_HISTORY_SEQ = bankUserBalance[temp].WALLET_HISTORY_SEQ -1;
          this.depositInfo.WALLET_HISTORY_SEQ = this.bankUserBalance[i].WALLET_HISTORY_SEQ; 
          this.depositInfo.WALLET_ID = this.bankUserBalance[i].WALLET_ID;
          this.depositInfo.USER_ID = this.bankUserBalance[i].USER_ID;
          // this.depositInfo.GUBUN = "I";
          this.depositInfo.SORT = 6;
          this.depositInfo.COIN_ID="HSS";
          this.depositInfo.AMOUNT = this.bankUserBalance[i].AMOUNT;
          this.depositInfo.BALANCE = this.bankUserBalance[i].BALANCE;
          // this.depositInfo.REASON = "입금";
          // this.depositInfo.REASON_DETAIL = "HSS 입금";
          this.depositInfo.REG_DATE = this.getTimeStamp();
          this.depositInfo.REG_USER = this.bankUserBalance[i].USER_ID;
          this.depositInfo.UP_DATE = this.getTimeStamp();
          this.depositInfo.UP_USER = this.bankUserBalance[i].USER_ID;
          this.depositInfo.USE_FLAG = this.bankUserBalance[i].USE_FLAG;
          break;
         
        }
      }
      console.log(this.depositInfo);
    })

  }
  
  /*******   User Deposit  *******/
  updateUserDeposit(){
    
      this.depositInfo.GUBUN = "I";
      this.depositInfo.REASON = "입금";
      this.depositInfo.REASON_DETAIL = "HSS 입금";
      this.depositInfo.BALANCE = Number(this.amount) + Number(this.depositInfo.BALANCE); 
      this.depositInfo.WALLET_ID = this.wallet_id;
      
      this.depositInfo.AMOUNT = this.amount; 
      console.log(this.depositInfo.BALANCE)
      this.restfulService.httpPost("bank_user_balance_history/deposit",this.depositInfo).subscribe(Response=>{
      })
      this.amount = this.depositInfo.BALANCE;
  
    
    
  }

  /*******   User Withdrawal  *******/
  updateUserWithdrawal(){
    this.depositInfo.GUBUN = "O";
    this.depositInfo.REASON = "출금";
    this.depositInfo.REASON_DETAIL = "HSS 출금";
    this.depositInfo.BALANCE =  Number(this.depositInfo.BALANCE) - Number(this.amount); 
    console.log(Number(this.amount))
    console.log(Number(this.depositInfo.BALANCE))
    this.depositInfo.WALLET_ID = this.wallet_id;
    this.depositInfo.AMOUNT = this.amount; 
    console.log(this.depositInfo.BALANCE)
    this.restfulService.httpPost("bank_user_balance_history/deposit",this.depositInfo).subscribe(Response=>{
    })
    this.amount = this.depositInfo.BALANCE;
    

    
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


  deposit_alert(){
    if(confirm("입금을 하시겠습니까?")){
      if(isNaN(this.amount)){
        alert("금액을 숫자로 입력하세요.")
      }else{
        this.updateUserDeposit()
        this.router.navigateByUrl('/com/check-exchange')
      }
      
   } else{
      alert("입금을 취소했습니다.")
   }

  }

  withdrawal_alert(){
    if(confirm("출금을 하시겠습니까?")){
      if(isNaN(this.amount) || this.depositInfo.BALANCE - this.amount < 0 ){
        alert("금액을 다시 확인하세요.")
      }else{
        this.updateUserWithdrawal()
        this.router.navigateByUrl('/com/check-exchange')
      } 
   } else{
      alert("출금을 취소했습니다.")
   }

  }

   dateSelector(){
    //date Parsing

    if(this.date.start_date !=null && this.date.end_date!=null){
      const s_momentDate = new Date(this.date.start_date); 
      const s_formattedDate = moment(s_momentDate).format("YYYY-MM-DD");
      const e_momentDate = new Date(this.date.end_date); 
      const e_formattedDate = moment(e_momentDate).format("YYYY-MM-DD");
      this.date.start_date = s_formattedDate;
      this.date.end_date = e_formattedDate;
      //send Date
      this.restfulService.httpPost('getDate',this.date).subscribe(Response=>{
        this.date.start_date ='';
        this.date.end_date='';
        console.log(Response);
     //refresh Line Chart Data
      let HSSquote:Array<HSSquoteVO> = new Array<HSSquoteVO>();
      const temp:any = Response;
      HSSquote = temp;
      this.HSS_USDT_PRICE.length = 0;
      this.REG_DATE.length = 0;
      for(let i=0; i<HSSquote.length; i++){
            
            this.HSS_USDT_PRICE.push(HSSquote[i].USDT_PRICE);
            this.REG_DATE.push(HSSquote[i].REG_DATE);
      }  
      this.HSS_USDT_PRICE.reverse();
      this.REG_DATE.reverse();
      console.log(this.HSS_USDT_PRICE)

      });
      
    }

  }
 
 
  
  









}
