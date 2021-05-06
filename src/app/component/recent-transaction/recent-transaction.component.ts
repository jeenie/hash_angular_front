import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

import { HashService } from '../Service/HashService'
import { UserBalanceHistoryVO } from '../VO/UserBalanceHistoryVO';
import { BtcPriceVO } from '../VO/BtcPriceVO'
import { RecentTransactionVO } from '../VO/RecentTransactionVO';
import { UserWalletHistoryVO } from '../VO/UserWalletHistoryVO';


let data: RecentTransactionVO[] = [];

interface Food {
    value: string;
    viewValue: string;
  }
  
  interface Car {
    value: string;
    viewValue: string;
  }

@Component({
    selector: 'app-recent-transaction',
    templateUrl: './recent-transaction.component.html',
    styleUrls: ['./recent-transaction.component.css'],
    providers: [HashService]
})



export class RecentTransactionComponent implements OnInit {
    userBalanceHistoryList: UserBalanceHistoryVO[] = [];
    userWalletHistoryList: UserWalletHistoryVO[] = [];
    btcPriceList: BtcPriceVO[] = [];
    recentTransactionList: RecentTransactionVO[] =[];

    selectedValue!: string;
    selectedCar!: string;

    foods: Food[] = [
        {value: 'steak-0', viewValue: 'BTC/KRW'},
        {value: 'pizza-1', viewValue: 'HSS/KRW'}
    ];

  

    displayedColumns: string[] =[
        'usdPrice',
        'amount',
        'regDate'
    ];
    
    dataSource = new MatTableDataSource(data);

    constructor(private http: HttpClient, private HashService: HashService) {
        this.getUserWalletHistory();
    }

    ngOnInit() {

    }

    getUserWalletHistory() {
        this.HashService.getUserWalletHistory().subscribe(response => {
            let JsonArray: any[];
            JsonArray = Object.values(response);

            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserWalletHistoryVO(JsonArray[i]['NO'], JsonArray[i]['WALLET_ID'], JsonArray[i]['USER_ID'], JsonArray[i]['PUBKEY'], JsonArray[i]['FEE'], JsonArray[i]['TX'], JsonArray[i]['PAY_GUBUN'], JsonArray[i]['PAY_STATE'], JsonArray[i]['COIN'], JsonArray[i]['COIN_ID'], JsonArray[i]['CONFIRM'], new Date(JsonArray[i]['REG_DATE']), JsonArray[i]['REG_USER'], JsonArray[i]['UP_DATE'], JsonArray[i]['UP_USER'], JsonArray[i]['USE_FLAG'], JsonArray[i]['END_FLAG'] )
                this.userWalletHistoryList.push(item);
            }
            this.getBtcPriceList()
        })
    }

    getBtcPriceList() {
        this.HashService.getBtcPriceJson2().subscribe(response => {
            let JsonArray: any[];
            JsonArray = Object.values(response);

            for(let i = 0; i < JsonArray.length; i++) {
                var item = new BtcPriceVO(JsonArray[i]['NO'], JsonArray[i]['COIN_ID'], JsonArray[i]['COIN_NAME'], JsonArray[i]['USD_PRICE'], new Date(JsonArray[i]['REG_DATE']));
                this.btcPriceList.push(item);
            }
            
            

            this.makeRecentTransactionList(this.userWalletHistoryList, this.btcPriceList);

            this.makeOrderBookList(this.userWalletHistoryList, this.btcPriceList);
        })
        //console.log(this.btcPriceList.length);
    }

    makeRecentTransactionList(walletList: UserWalletHistoryVO[], priceList: BtcPriceVO[]) {
        //console.log(walletList.length);
        //console.log(priceList.length)
        
        for(let i = 0; i < walletList.length; i++) {
            for(let j = 0; j< priceList.length; j++) {
                if(walletList[i].PAY_STATE == 'P' && priceList[j].regDate < walletList[i].REG_DATE && walletList[i].COIN != 0) { // wallet coin 변경
                    //console.log(priceList[j].regDate < balanceList[i].REG_DATE)

                    var item = new RecentTransactionVO(priceList[j].usdPrice, walletList[i].PAY_GUBUN, walletList[i].COIN, walletList[i].REG_DATE);
                    this.recentTransactionList.push(item);
                    break;
                }
                
            }
            
        }
        
         //console.log(this.recentTransactionList)
         this.dataSource.data = this.recentTransactionList;
    }

    makeOrderBookList(walletList: UserWalletHistoryVO[], priceList: BtcPriceVO[]) {
        let buying: RecentTransactionVO[] = [];
        let selling: RecentTransactionVO[] = [];
        let transactionList: RecentTransactionVO[] = [];

        for(let i = 0; i < walletList.length; i++) {
            for(let j = 0; j< priceList.length; j++) {
                if(walletList[i].PAY_STATE == 'P' && priceList[j].regDate < walletList[i].REG_DATE && walletList[i].COIN != 0) { // wallet coin 변경
                    //console.log(priceList[j].regDate < balanceList[i].REG_DATE)

                    var item = new RecentTransactionVO(priceList[j].usdPrice, walletList[i].PAY_GUBUN, walletList[i].COIN, walletList[i].REG_DATE);
                    transactionList.push(item);
                    break;
                }
                
            }
            
        }
        //console.log(transactionList);
        for(let i = 0; i <transactionList.length; i++) {
            if(transactionList[i].gubun == 'I') {
                buying.push(transactionList[i]);
            } else {
                selling.push(transactionList[i]);
            }
        }

        buying.sort((a:RecentTransactionVO, b:RecentTransactionVO) => {
            return b.regDate < a.regDate ? -1 : 1;
        })
        selling.sort((a:RecentTransactionVO, b:RecentTransactionVO) => {
            return a.regDate < b.regDate ? -1 : 1;
        })
        
        console.log(selling)
        console.log('buying 시간 현재 -> 과거')
        console.log(buying)

        
    }

}