import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// 날짜 조회
import { FormGroup, FormControl } from '@angular/forms';

//auto-complement
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { UserRewardService } from '../user-reward/UserRewardService';
import { UserInfoVO } from '../VO/UserInfoVO';
import { UserProductVO } from '../VO/UserProductVO';
import { UserProductSimpleVO } from '../VO/UserProductSimpleVO';
import { UserSalesRewardVO } from '../VO/UserSalesRewardVO';


let data: UserSalesRewardVO[] = [];

@Component({
    selector: 'app-all-reward',
    templateUrl: './all-reward.component.html',
    styleUrls: ['./all-reward.component.css'],
    providers: [UserRewardService],
})

export class AllRewardComponent implements OnInit{
    userInfoList: UserInfoVO[];
    userProductList: UserProductVO[];

    userProductInfoList: UserProductSimpleVO[];

    userSalesAllList: UserSalesRewardVO[];

    displayedColumns: string[] = [
        'userId',
        'totalCoin',
        'totalUsd'
    ];

    dataSource = new MatTableDataSource(data);
    dataSource2 = new MatTableDataSource(data);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    allTotalUsd=0;
    allTotalCoin=0;


    globalFilter = '';

    myControl = new FormControl();
    options: string[] = [];
    filteredOptions: Observable<string[]> | undefined;

    constructor(private http: HttpClient, private UserRewardService: UserRewardService) {
        this.userInfoList = [];
        this.userProductList=[];
        this.userProductInfoList=[];
        this.userSalesAllList=[];

        
        this.getUserProductList();
        this.getUserInfoList();
        
    }

    ngOnInit(){
        this.dataSource.filterPredicate = this.customFilterPredicate();

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

    getUserInfoList() {
        this.UserRewardService.getUserInfoJson().subscribe(response =>{
            let JsonArray: any[];
            JsonArray = Object.values(response);

            //userInfoList 생성
            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserInfoVO(JsonArray[i]['USER_ID'], JsonArray[i]['USER_NAME'], JsonArray[i]['USER_PHONE'], JsonArray[i]['USER_EMAIL'], JsonArray[i]['USER_PHONE_CN'], JsonArray[i]['REC_USER'], JsonArray[i]['REC_DIR'], JsonArray[i]['USER_L'], JsonArray[i]['USER_R'], JsonArray[i]['REG_DATE']);
                this.userInfoList.push(item);
            }  
            this.makeNewUserProductList();
            //this.makeUserRelation(this.userInfoList);
        })
    }

    getUserProductList() {
        this.UserRewardService.getUserProductJson().subscribe(response =>{
            let JsonArray: any[];
            JsonArray = Object.values(response);

            //userInfoList 생성
            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserProductVO(JsonArray[i]['PT_CODE'], JsonArray[i]['USER_ID'], JsonArray[i]['PRODUCT_CD'], JsonArray[i]['PRODUCT_TYPE'], JsonArray[i]['PRODUCT_STATE'], JsonArray[i]['PRODUCT_THS'], new Date(JsonArray[i]['AP_DATE']), JsonArray[i]['GD_DATE'], JsonArray[i]['ST_COIN'], JsonArray[i]['CRT_USD'], JsonArray[i]['AUTO_SHIP'], new Date(JsonArray[i]['REG_DATE']), JsonArray[i]['REG_USER'], new Date(JsonArray[i]['UP_DATE']), JsonArray[i]['UP_USER'], JsonArray[i]['USE_FLAG']);
                if(item.PRODUCT_STATE =='G') {
                    this.userProductList.push(item);
                }
               
            }

            //console.log('사용자 상품 목록 (PRODUCT_STATE = P, G)');
            //console.log(this.userProductList);
            
        })
        
    }

    makeNewUserProductList() {
        for(let i = 0; i < this.userInfoList.length; i++) {
            
            //console.log(this.userInfoList[i].USER_ID)
            for(let j = 0; j < this.userProductList.length; j++) {
                //console.log(this.userProductList[j].USER_ID)
                if(this.userInfoList[i].USER_ID == this.userProductList[j].USER_ID) {
                    //console.log(this.userInfoList[i].USER_ID)
                    var item = new UserProductSimpleVO(this.userProductList[j].PT_CODE,
                                                       this.userInfoList[i].USER_ID, 
                                                       this.userProductList[j].PRODUCT_TYPE, 
                                                       this.userProductList[j].PRODUCT_STATE, 
                                                       this.userProductList[j].PRODUCT_THS, 
                                                       this.userProductList[j].ST_COIN, 
                                                       this.userProductList[j].CRT_USD, 
                                                       this.userProductList[j].REG_DATE, 
                                                       this.userInfoList[i].REC_USER);
                    this.userProductInfoList.push(item);
                }   
            }
        }
        console.log(this.userProductInfoList);
        this.makeUserRelation(this.userProductInfoList);
    }

    makeUserRelation(list:UserProductSimpleVO[]) {
        let child =[]; //UserProductSimpleVO : 세대별 생성후 relationArray로 push
        let relationArray = []; // UserProductSimpleVO [][] : 1~5세대 생성
        let allRelationArray = [];

        var bigCoin =0;
        var bigUsd =0;

        for(let i = 0; i < list.length; i++) {
            child = [];
            for(let j = 0; j < list.length; j++) {
                if(list[i].USER_ID === list[j].REG_USER) {

                    child.push(list[j]);
                } 
            }
            relationArray.push(child);

            for(let h = 1; h < 5; h++) {
                child= [];
                for(let j = 0; j < relationArray[h-1].length; j++) {
                    for(let k =0; k < list.length; k++) {
                        if(relationArray[h-1][j].USER_ID === list[k].REG_USER) {
                            child.push(list[k]);
                        }
                    }
                }
                // ptcode로 소트하고
                // 옆에랑 다르면 push
                let childs=[]
                child.sort((a:UserProductSimpleVO, b:UserProductSimpleVO)=> {
                    return a.PT_CODE < b.PT_CODE? -1: 1;
                })
                for(let i =0; i <child.length; i++) {
                    if(i==child.length-1) {
                        childs.push(child[i])
                    }else {
                        if(child[i].PT_CODE != child[i+1].PT_CODE) {
                            childs.push(child[i])
                        }
                    }
                }
                //childs.push(child[child.length-1])
                relationArray.push(childs);
            }
            
            var ratio = [0.05, 0.04, 0.03, 0.02, 0.01];

            bigCoin = 0;
            bigUsd = 0;
            var sumCoin=0;
            var sumUsd=0;
            for(let l=0; l<relationArray.length; l++) { // 5번
                sumCoin=0;
                sumUsd=0;
                for(let m=0; m<relationArray[l].length; m++) { // 각 세대 별로
                    var num: number = + relationArray[l][m].ST_COIN;
                    sumCoin+= num;
                    var num2: number = + relationArray[l][m].CRT_USD;
                    sumUsd+= num2;
                }
                
                bigCoin += sumCoin * ratio[l]
                bigUsd += sumUsd * ratio[l]
            }
            this.userSalesAllList.push(new UserSalesRewardVO(list[i].USER_ID, bigCoin, bigUsd, relationArray));
            relationArray = [];
        }
        this.userSalesAllList.sort((a:UserSalesRewardVO, b:UserSalesRewardVO) => {
            return b.totalUsd - a.totalUsd;
        })

        
          
        this.userSalesAllList = this.userSalesAllList.filter((thing, i, arr) => arr.findIndex(t => t.userId === thing.userId) === i)
        this.userSalesAllList.sort((a:UserSalesRewardVO, b:UserSalesRewardVO) => {
            return a.userId < b.userId ? -1: 1;
        })
        this.dataSource.data = this.userSalesAllList;
        console.log(this.userSalesAllList);

        this.allTotalUsd = 0;
        this.allTotalCoin = 0;
        for(let a=0; a < this.userSalesAllList.length; a++) {
            var num: number = + this.userSalesAllList[a].totalUsd
            this.allTotalUsd +=num;
            var num2: number = + this.userSalesAllList[a].totalCoin
            this.allTotalCoin+=num2;
        }

        console.log(this.allTotalUsd);
        console.log(this.allTotalCoin);

        this.userSalesAllList.sort((a:UserSalesRewardVO, b:UserSalesRewardVO) => {
            return b.totalCoin - a.totalCoin ;
        })

        let userRewardBest = [];
        for(let i = 0; i< 10; i++ ) {
            userRewardBest.push(this.userSalesAllList[i])
        }
        this.dataSource2.data = userRewardBest;
        this.options = this.getFilterObject(this.userSalesAllList);

    }

    getFilterObject(fullobj: UserSalesRewardVO[]) {
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

    Submit(){
        this.applyFilter(this.myControl.value)
    }

    applyFilter(filter: string) {
        this.globalFilter = filter;
        console.log("무슨값"+this.globalFilter);
        this.dataSource.filter = JSON.stringify(this.globalFilter);
    }

    customFilterPredicate() {
        const myFilterPredicate = (data: UserSalesRewardVO, filter: string): boolean => {
            var globalMatch = !this.globalFilter;

            if (this.globalFilter) {
                globalMatch = data.userId.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1;

                    


                return globalMatch;
            }
            return false;
        }
        return myFilterPredicate;
    }
}
