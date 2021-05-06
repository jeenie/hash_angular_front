import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

// 날짜 조회
import { FormGroup, FormControl } from '@angular/forms';

import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MatAccordion} from '@angular/material/expansion';

import { UserRewardService } from '../user-reward/UserRewardService';
import { UserInfoVO } from '../VO/UserInfoVO';
import { UserProductVO } from '../VO/UserProductVO';
import { ChildDetailVO } from '../VO/ChildDetailVO';
import { UserBalanceVO } from '../VO/UserBalanceVO';

let data: ChildDetailVO[] = [];

@Component({
    selector: 'app-user-reward',
    templateUrl: './usermode-reward.component.html',
    styleUrls: ['./usermode-reward.component.css'],
    providers: [UserRewardService]
})

export class UserModeRewardComponent implements OnInit{
    userInfoList: UserInfoVO[];
    userProductList: UserProductVO[];
    userBalanceList: UserBalanceVO[];
    childList: UserProductVO[];

    relationArray: any[];
    

    userTrading: any[];
    userSumCoin: number[];
    userSumUsd: number[];

    childArray: ChildDetailVO[];
    ratio = [0.05,0.04,0.03,0.02,0.01];
    displayedColumns: string[] = [
        'no',
        'totalCoin',
        'totalUsd'
    ];

    displayedColumns2: string[] = [
        'USER_ID',
        'PRODUCT_THS',
        'ST_COIN',
        'CRT_USD',
        'REG_DATE',
        'final_child'
    ]
    
    dataSource = new MatTableDataSource(data);
    expandedElement: ChildDetailVO | null | undefined;

    totalCoin!:number;
    totalUsd!:number;

    rewardTotalCoin!: number;
    rewardTotalUsd!: number;

    selectedUserId!: string;
    selectedUserIdBalanceData: UserBalanceVO;
    
    filterForm = new FormGroup({
        fromDate: new FormControl(),
        toDate: new FormControl(),
        //searchStr: new FormControl()
    });

    get fromDate() { return this.filterForm.get('fromDate')?.value; }
    get toDate() { return this.filterForm.get('toDate')?.value; }

    myControl = new FormControl();
    options: string[] = [];
    filteredOptions: Observable<string[]> | undefined;

    @ViewChild(MatAccordion) accordion!: MatAccordion;

    displayedRows$: Observable<ChildDetailVO[]> | undefined;
    totalRows$: Observable<number> | undefined;

    constructor(private http: HttpClient, private UserRewardService: UserRewardService) {
        this.userInfoList = [];
        this.userProductList =[];
        this.userBalanceList= [];
        this.childList=[];
        this.relationArray=[];

        
        this.userTrading = new Array();
        this.userSumCoin= [];
        this.userSumUsd= [];

        this.childArray=[];

        this.getUserInfoList();
        this.getUserBalanceList();

        this.totalCoin = 0;
        this.totalUsd = 0;
        
        this.rewardTotalCoin = 0;
        this.rewardTotalUsd =0;
        
        this.selectedUserId = 'godia'
        this.selectedUserIdBalanceData = new UserBalanceVO(new Date(), '', '', '', '', '', '', '', '');
        
        this.filterForm.valueChanges.subscribe(x => {
            this.childList=[];
            this.relationArray=[];

            
            this.userTrading = new Array();
            this.userSumCoin= [];
            this.userSumUsd= [];

            this.childArray=[];
            this.userProductList =[];
            this.makeUserRelation(this.userInfoList, this.selectedUserId);
        })
    }
    
    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }

    getUserBalanceList() {
        this.UserRewardService.getUserBalanceJson().subscribe(response => {
            let JsonArray: any[];
            JsonArray = Object.values(response);

            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserBalanceVO(new Date(JsonArray[i]['REG_DATE']), JsonArray[i]['USER_ID'], JsonArray[i]['WALLET_ID'], JsonArray[i]['GUBUN'], JsonArray[i]['REASON'], JsonArray[i]['REASON_DETAIL'], JsonArray[i]['COIN_ID'], JsonArray[i]['AMOUNT'], JsonArray[i]['BALANCE']);
                this.userBalanceList.push(item);
            }
            this.getSelectedIdBalanceData(this.selectedUserId);
            
        })
    }

    getUserProductList() {
        this.UserRewardService.getUserProductJson().subscribe(response =>{
            let JsonArray: any[];
            JsonArray = Object.values(response);

            //userInfoList 생성
            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserProductVO(JsonArray[i]['PT_CODE'], JsonArray[i]['USER_ID'], JsonArray[i]['PRODUCT_CD'], JsonArray[i]['PRODUCT_TYPE'], JsonArray[i]['PRODUCT_STATE'], JsonArray[i]['PRODUCT_THS'], new Date(JsonArray[i]['AP_DATE']), JsonArray[i]['GD_DATE'], JsonArray[i]['ST_COIN'], JsonArray[i]['CRT_USD'], JsonArray[i]['AUTO_SHIP'], new Date(JsonArray[i]['REG_DATE']), JsonArray[i]['REG_USER'], new Date(JsonArray[i]['UP_DATE']), JsonArray[i]['UP_USER'], JsonArray[i]['USE_FLAG']);
                this.userProductList.push(item);
            }
            this.sumUserTrading(this.userProductList);
            
        })
    }

    //userInfoList 생성
    getUserInfoList() {
        this.UserRewardService.getUserInfoJson().subscribe(response =>{
            let JsonArray: any[];
            JsonArray = Object.values(response);

            //userInfoList 생성
            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserInfoVO(JsonArray[i]['USER_ID'], JsonArray[i]['USER_NAME'], JsonArray[i]['USER_PHONE'], JsonArray[i]['USER_EMAIL'], JsonArray[i]['USER_PHONE_CN'], JsonArray[i]['REC_USER'], JsonArray[i]['REC_DIR'], JsonArray[i]['USER_L'], JsonArray[i]['USER_R'], JsonArray[i]['REG_DATE']);
                this.userInfoList.push(item);
            }

            this.options = this.getFilterObject(this.userInfoList)
            //console.log("자동완성 목록 만들기")
            //console.log(this.options);
        
            this.makeUserRelation(this.userInfoList, this.selectedUserId);
            
        })
        

    }

    // 사용자 아래 depth 5 노드 찾기
    makeUserRelation(list: UserInfoVO[], userId: string) {
        this.childList=[];
        this.relationArray=[];

        
        this.userTrading = new Array();
        this.userSumCoin= [];
        this.userSumUsd= [];

        this.childArray=[];
        let child =[];

        for(let i = 0; i < list.length; i++) {
            if(userId === list[i].REC_USER) {
                child.push(list[i]);
            } 
        }
        this.relationArray.push(child);


        for(let h = 1; h < 5; h++) {
            child = [];
            for(let j = 0; j < this.relationArray[h-1].length; j++) {
                for(let i = 0; i < list.length; i++) {
                    if(this.relationArray[h-1][j].USER_ID === list[i].REC_USER) {
                        child.push(list[i]);
                    }
                }
            }
            this.relationArray.push(child);
        }

        console.log('사용자와 하위 멤버 구성')
        console.log(this.relationArray);

        //사용자와 하위 멤버 구성 정상 구현
        this.getUserProductList();

        
    }
 
    //dataSource 생성
    sumUserTrading(list: UserProductVO[]) {
        let trading = [];
        this.userTrading = [];

        for(let h = 0; h <this.relationArray.length; h++) { // 5세대 탐색
            trading =[];
            for(let i = 0; i < this.relationArray[h].length; i++) { //각 세대 목록 탐색
                for(let j = 0; j < list.length; j++) {  
                    
                    if(this.relationArray[h][i].USER_ID === list[j].USER_ID && list[j].PRODUCT_STATE === 'G') {
                        // 세대 번호
                        list[j].child_status = h+1;

                        // 만료 일자 생성
                        var year = list[j].REG_DATE.getFullYear();
                        var month = list[j].REG_DATE.getMonth();
                        var date = list[j].REG_DATE.getDate();

                        
                            list[j].exp_date = new Date(year +2, month, date, 23, 59, 59);
                            if(new Date(year +2, month, date, 23, 59, 59) > new Date()) {
                                this.childList.push(list[j]);
                                trading.push(list[j]);
                            }
                        

                        
                        
                    }
                }
            }
            this.userTrading.push(trading);
            
        }
        //userTrading 구현 : (상품 가동 상태 : G)인 하위 멤버로 구성
        console.log('사용자와 하위 멤버의 상품 구성, 가동 G')
        console.log(this.userTrading);
       
        //console.log(this.userTrading)

        this.childArray = [];

        // 각 세대별 매출 합
        // 실제 표에 나올 데이터
        for(let i = 0; i < this.userTrading.length; i++) {
            let sumCoin = 0;
            let sumUsd = 0;
            for(let j = 0; j < this.userTrading[i].length; j++) {
                var num : number = + this.userTrading[i][j].ST_COIN;
                var num2 : number = + this.userTrading[i][j].CRT_USD;
                sumCoin += num;
                sumUsd += num2;
                this.userTrading[i][j].total_coin = sumCoin;
                this.userTrading[i][j].total_usd = sumUsd;
            }
            
            var item = new ChildDetailVO(i+1, sumCoin, sumUsd, sumCoin * this.ratio[i], sumUsd * this.ratio[i], this.userTrading[i]);
            //console.log(item);
            this.childArray.push(item);
            //console.log(sumCoin * this.ratio[i]);
            
            //this.userTrading[i].total_coin = sumCoin;
            this.userTrading[i].total_usd = sumUsd;
            this.userSumCoin.push(sumCoin);
            this.userSumUsd.push(sumUsd);
        }
        console.log(this.childArray)
        //this.dataSource.data = this.childArray;
        const rows$ = of(this.childArray);

        this.totalRows$ = rows$.pipe(map(rows => rows.length));
        this.displayedRows$ = rows$;

        this.totalUsd =0;
        this.totalCoin =0;
        for(let k=0; k <this.userProductList.length; k++) {
            if(this.selectedUserId == this.userProductList[k].USER_ID) {
                var num: number= + this.userProductList[k].ST_COIN
                this.totalCoin += num;
                var num2: number= + this.userProductList[k].CRT_USD
                this.totalUsd += num2
            }
        }

        this.rewardTotalCoin = 0;
        this.rewardTotalUsd = 0;
        this.rewardTotalUsd = this.userSumUsd[0] * this.ratio[0] + this.userSumUsd[1] * this.ratio[1] + this.userSumUsd[2] * this.ratio[2] + this.userSumUsd[3] * this.ratio[3] + this.userSumUsd[4] * this.ratio[4];
        this.rewardTotalCoin = this.userSumCoin[0] * this.ratio[0] + this.userSumCoin[1] * this.ratio[1] + this.userSumCoin[2] * this.ratio[2] + this.userSumCoin[3] * this.ratio[3] + this.userSumCoin[4] * this.ratio[4];
        
        for(let i = 0; i <this.childList.length-1; i++) {
            if(this.childList[i+1].child_status != this.childList[i].child_status) {
                this.childList[i].final_child= true;
            }
        }
        this.childList[this.childList.length-1].final_child= true;

        
    }

    

    getFilterObject(fullobj: UserInfoVO[]) {
        const uniqChk: string[] = [];
        fullobj.filter((obj) => {
            if(!uniqChk.includes(obj.USER_ID)) {
                uniqChk.push(obj.USER_ID);
            }
            return obj;
        });

        return uniqChk.sort((a: string, b: string) => {
            return (b.toLowerCase() > a.toLowerCase() ? -1: 1);
        });
    }

    getSelectedIdBalanceData(id: string) {
        for(let i = 0; i < this.userBalanceList.length; i++) {
            if(id === this.userBalanceList[i].userId) {
                this.selectedUserIdBalanceData = this.userBalanceList[i];
                //console.log(this.userBalanceList[i]);
                return
            }
        }
        return new UserBalanceVO(new Date(), '', '', '', '', '', '', '', '');
    }

    Submit(){
        //console.log(this.myControl);
        this.selectedUserId = this.myControl.value;

        this.getSelectedIdBalanceData(this.selectedUserId);
        this.dataSource.data=[];

        this.childList=[];
        this.relationArray=[];

        
        this.userTrading = new Array();
        this.userSumCoin= [];
        this.userSumUsd= [];

        this.childArray=[];
        this.userProductList =[];

        
        this.makeUserRelation(this.userInfoList, this.selectedUserId);
     }

    SubmitDate() {
        console.log(this.myControl)
        this.sumUserTradingDate(this.userProductList);
    }

    sumUserTradingDate(list: UserProductVO[]) {
        let trading = [];
        this.userTrading = [];

        for(let h = 0; h <this.relationArray.length; h++) { // 5세대 탐색
            trading =[];
            for(let i = 0; i < this.relationArray[h].length; i++) { //각 세대 목록 탐색
                for(let j = 0; j < list.length; j++) {  
                    
                    if(this.relationArray[h][i].USER_ID === list[j].USER_ID && list[j].PRODUCT_STATE === 'G') {
                        // 세대 번호
                        list[j].child_status = h+1;

                        // 만료 일자 생성
                        var year = list[j].REG_DATE.getFullYear();
                        var month = list[j].REG_DATE.getMonth();
                        var date = list[j].REG_DATE.getDate();

                        if(this.fromDate && this.toDate) {
                            //console.log('날짜 입력')
                            var newDate = new Date(this.toDate);

                            let searchEndDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 59);
                            list[j].exp_date = new Date(year +2, month, date, 23, 59, 59);
                            if(new Date(year +2, month, date, 23, 59, 59) >= searchEndDate) {
                                //console.log(list[j].REG_DATE);

                                
                                this.childList.push(list[j]);
                                trading.push(list[j]);
                            }
                        } else {
                            list[j].exp_date = new Date(year +2, month, date, 23, 59, 59);
                            if(new Date(year +2, month, date, 23, 59, 59) > new Date()) {
                                this.childList.push(list[j]);
                                trading.push(list[j]);
                            }
                        }

                        
                        
                    }
                }
            }
            this.userTrading.push(trading);
            
        }
        //userTrading 구현 : (상품 가동 상태 : G)인 하위 멤버로 구성
        console.log('사용자와 하위 멤버의 상품 구성, 가동 G')
        console.log(this.userTrading);
       
        //console.log(this.userTrading)

        this.childArray = [];

        // 각 세대별 매출 합
        // 실제 표에 나올 데이터
        for(let i = 0; i < this.userTrading.length; i++) {
            let sumCoin = 0;
            let sumUsd = 0;
            for(let j = 0; j < this.userTrading[i].length; j++) {
                var num : number = + this.userTrading[i][j].ST_COIN;
                var num2 : number = + this.userTrading[i][j].CRT_USD;
                sumCoin += num;
                sumUsd += num2;
                this.userTrading[i][j].total_coin = sumCoin;
                this.userTrading[i][j].total_usd = sumUsd;
            }
            
            var item = new ChildDetailVO(i+1, sumCoin, sumUsd, sumCoin * this.ratio[i], sumUsd * this.ratio[i], this.userTrading[i]);
            //console.log(item);
            this.childArray.push(item);
            //console.log(sumCoin * this.ratio[i]);
            
            //this.userTrading[i].total_coin = sumCoin;
            this.userTrading[i].total_usd = sumUsd;
            this.userSumCoin.push(sumCoin);
            this.userSumUsd.push(sumUsd);
        }
        console.log(this.childArray)
        //this.dataSource.data = this.childArray;
        const rows$ = of(this.childArray);

        this.totalRows$ = rows$.pipe(map(rows => rows.length));
        this.displayedRows$ = rows$;

        this.totalUsd =0;
        this.totalCoin =0;
        for(let k=0; k <this.userProductList.length; k++) {
            if(this.selectedUserId == this.userProductList[k].USER_ID) {
                var num: number= + this.userProductList[k].ST_COIN
                this.totalCoin += num;
                var num2: number= + this.userProductList[k].CRT_USD
                this.totalUsd += num2
            }
        }

        this.rewardTotalCoin = 0;
        this.rewardTotalUsd = 0;
        this.rewardTotalUsd = this.userSumUsd[0] * this.ratio[0] + this.userSumUsd[1] * this.ratio[1] + this.userSumUsd[2] * this.ratio[2] + this.userSumUsd[3] * this.ratio[3] + this.userSumUsd[4] * this.ratio[4];
        this.rewardTotalCoin = this.userSumCoin[0] * this.ratio[0] + this.userSumCoin[1] * this.ratio[1] + this.userSumCoin[2] * this.ratio[2] + this.userSumCoin[3] * this.ratio[3] + this.userSumCoin[4] * this.ratio[4];
        
        for(let i = 0; i <this.childList.length-1; i++) {
            if(this.childList[i+1].child_status != this.childList[i].child_status) {
                this.childList[i].final_child= true;
            }
        }
        this.childList[this.childList.length-1].final_child= true;

        
    }
}