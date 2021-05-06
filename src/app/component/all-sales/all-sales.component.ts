import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';

// 날짜 조회
import { FormGroup, FormControl } from '@angular/forms';

//auto-complement
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { UserRewardService } from '../user-reward/UserRewardService';
import { UserInfoVO } from '../VO/UserInfoVO';
import { UserProductVO } from '../VO/UserProductVO';
import { ChildDetailVO } from '../VO/ChildDetailVO';
import { UserBalanceVO } from '../VO/UserBalanceVO';
import { UserSalesVO } from '../VO/UserSalesVO';

let data: UserSalesVO[] = [];

@Component({
    selector: 'app-user-reward',
    templateUrl: './all-sales.component.html',
    styleUrls: ['./all-sales.component.css'],
    providers: [UserRewardService]
})

export class AllSalesComponent implements OnInit{
    userProductList: UserProductVO[];
    ratio = [0.05,0.04,0.03,0.02,0.01];
    displayedColumns: string[] = [
        'userId',
        'totalCoin',
        'totalUsd'
    ];
    
    dataSource = new MatTableDataSource(data);
    userSalesRealData: UserSalesVO[] = [];


    dataSource2 = new MatTableDataSource(data);

    totalCoin!:number;
    totalUsd!:number;

    //paging과 sort를 위한 객체 전달
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    userId: string[] = ['id1', 'id2', 'id3', 'id4']

    filterSelectObj = [
        {
            name: '사용자 아이디',
            columnProp: 'USER_ID',
            options: ['']
        }
    ]

    globalFilter = '';

    selectedUserId!: string
    
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

    constructor(private http: HttpClient, private UserRewardService: UserRewardService) {
        
        this.userProductList =[];
        this.getUserProductList();
        
        this.totalCoin = 0;
        this.totalUsd = 0;

    }
    
    ngOnInit() {
        this.dataSource.filterPredicate = this.customFilterPredicate();

        // auto-complement
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
            this.sumUserSales(this.userProductList);
            
        })
    }

    //dataSource 생성
    sumUserSales(list: UserProductVO[]) {
        let userSalesAllData = [];
        let sumCoin = 0;
        let sumUsd = 0;
        for(let i=0; i<list.length; i++) {
            let id = list[i].USER_ID;
            sumCoin = 0;
            sumUsd = 0;
            for(let j=0; j <list.length; j++) {
                if(id === list[j].USER_ID && list[j].PRODUCT_STATE == 'G') {
                    var num : number =+ list[j].ST_COIN;
                    sumCoin += num;

                    var num2 : number =+ list[j].CRT_USD;
                    sumUsd += num2;
                }
            }
            //console.log(sumCoin);
            //console.log(sumUsd);

            var item = new UserSalesVO(id, sumCoin, sumUsd);
            userSalesAllData.push(item);
        }        

        userSalesAllData.sort((a:UserSalesVO, b:UserSalesVO) => {
            return a.userId < b.userId ? -1: 1;
        })
        //userSalesAllData = userSalesAllData.filter((thing, i, arr) => arr.findIndex(t=> t.userId === thing.userId));

        for(let i = 0; i < userSalesAllData.length - 1; i++) {
            if(userSalesAllData[i].userId != userSalesAllData[i+1].userId) {
                this.userSalesRealData.push(userSalesAllData[i]);
            }
        }

        this.dataSource.data = this.userSalesRealData;
        
        this.userSalesRealData.sort((a:UserSalesVO, b:UserSalesVO) => {
            return b.totalCoin - a.totalCoin ;
        })
        let userSalesBest = [];

        for(let i = 0; i< 10; i++ ) {
            userSalesBest.push(this.userSalesRealData[i])
        }

        this.dataSource2.data = userSalesBest;


        // 전체 매출
        this.totalCoin = 0;
        this.totalUsd =0;
        for(let i = 0; i < this.userSalesRealData.length; i++) {
            var num : number =+ this.userSalesRealData[i].totalCoin;
            this.totalCoin += num;
            var num2 : number =+ this.userSalesRealData[i].totalUsd;
            this.totalUsd += num2;
        }
        //console.log(this.totalUsd)

        this.options = this.getFilterObject(this.userSalesRealData);
    }

    getFilterObject(fullobj: UserSalesVO[]) {
        const uniqChk: string[] = [];
        fullobj.filter((obj) => {
            if(!uniqChk.includes(obj.userId)) {
                uniqChk.push(obj.userId);
            }
            return obj;
        });

        return uniqChk.sort((a: string, b: string) => {
            return (b.toLowerCase() > a.toLowerCase() ? -1: 1);
        });
    }

    applyFilter(filter: string) {
        this.globalFilter = filter;
        console.log("무슨값"+this.globalFilter);
        this.dataSource.filter = JSON.stringify(this.globalFilter);
    }

    customFilterPredicate() {
        const myFilterPredicate = (data: UserSalesVO, filter: string): boolean => {
            var globalMatch = !this.globalFilter;

            if (this.globalFilter) {
                globalMatch = data.userId.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1;

                    


                return globalMatch;
            }
            return false;
        }
        return myFilterPredicate;
    }

    Submit(){
        this.applyFilter(this.myControl.value)
    }

}