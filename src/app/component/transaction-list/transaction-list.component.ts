import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { DataSource } from '@angular/cdk/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment'


//import { TransactionVO } from './TransactionVO';
import { HttpClient } from '@angular/common/http';


import * as converter from 'xml-js';
import { TransactionVO } from './TransactionVO';
import { DatePipe, formatDate } from '@angular/common';

let data: TransactionVO[] = [];

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})


export class TransactionListComponent implements AfterViewInit {

    // filterForm 생성
    // fromDate : 시작 날짜
    // toDate : 끝 날짜
    filterForm = new FormGroup({
        fromDate: new FormControl(),
        toDate: new FormControl(),
        //searchStr: new FormControl()
    });

   
    // 검색 시작날짜와 끝날짜 읽어오는 메소드
    get fromDate() { return this.filterForm.get('fromDate')?.value; }
    get toDate() { return this.filterForm.get('toDate')?.value; }
    //get searchStr() { return this.filterForm.get('searchStr')?.value }


    /*
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.events.push(`${type}: ${event.value}`);
        const filterValue = (event.target).value;
        //console.log('이벤트 타겟' + filterValue);
        //this.range.value.start = event.value;
        //console.log('start date1:' + this.range.value.start + ' ////end date : ' + this.range.value.end);
        const startDate = new Date(this.range.value.start); // Replace event.value with your date value
        const endDate = new Date(this.range.value.end);
        const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
        const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
        console.log(formattedStartDate + '시작' + formattedEndDate);
        console.log('dataSource filter=>' + this.dataSource);
    }
    */

    // TransactionVO 가 원소인 배열
    transactionList: TransactionVO[];

    //컬럼 = TransactionVo의 속성
    displayedColumns: string[] = [
        'regDate', //거래날짜
        'userId', //사용자 아이디
        'walletId', //지갑 아이디
        'gubun', //입출금 정보
        'reason', //거래 사유
        'reasonDetail', // 거래 사유 상세
        'coinId', //코인 아이디(코인 구분)
        'amount', //거래량
        'balance' //잔액
    ];
    // paging, sorting, filtering을 위한 dataSource --> MatTableDataSource
    dataSource = new MatTableDataSource(data);
    // date filter
    fromDateFilter = new FormControl();
    toDateFilter = new FormControl();
    // userId filter
    userIdFilter = new FormControl();
    reasonFilter = new FormControl();
    // 전체 통합 검색
    globalFilter = '';

    // filtering
    filterValues = {};

    dateRange = {
        fromDate: Date,
        toDate: Date
    }

    filterSelectObj = [
        {
            name: '아이디',
            columnProp: 'userId',
            options : ['']
        }
    ]

    //paging과 sort를 위한 객체 전달
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort; 

    constructor(private http: HttpClient) {
        this.transactionList = [];
        //csv 파일 -> json
        this.http.get('assets/edu_bank_user_balance_history.csv', { responseType: 'text' }).subscribe(response => {

            let csvToRowArray = response.split("\n");
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
                let row = csvToRowArray[index].split(",");
                var date = new Date(row[10].slice(1, -1));

                this.transactionList.push(new TransactionVO(date, row[2].slice(1, -1), row[1].slice(1, -1), row[3].slice(1, -1), row[8].slice(1, -1), row[9].slice(1, -1), row[5].slice(1, -1), row[6].slice(1, -1), row[7].slice(1, -1)));
            }
            //console.log(this.transactionList);
            this.dataSource.data = this.transactionList;
            this.filterSelectObj.filter((o) => {
                o.options = this.getFilterObject(this.transactionList, o.columnProp);
            });
        },
            error => {
                console.log(error);
            }
        );
      

    };

    ngOnInit() {
        this.filterForm.valueChanges.subscribe((filterForm) => {

            this.dateRange['fromDate'] = filterForm.fromDate;
            this.dateRange['toDate'] = filterForm.toDate;
            this.dataSource.filter = '' + Math.random();
            //this.dataSource.filter = JSON.stringify(this.dateRange)
        });

        
        
        this.dataSource.filterPredicate = this.customFilterPredicate();

        
    }

    getFilterObject(fullobj: TransactionVO[], key: string) {
        const uniqChk: string[] = [];
        fullobj.filter((obj) => {
            if(!uniqChk.includes(obj.userId)) {
                uniqChk.push(obj.userId);
            }
            
            return obj;
        });
    
        return uniqChk.sort((a: string, b: string) => {
            return (b > a ? -1: 1);
        });
    }

    applyDateFilter() {
            this.dataSource.filter = '' + Math.random();
    }

    applyFilter(filter: string) {
        this.globalFilter = filter;
        console.log("무슨값"+this.globalFilter);
        this.dataSource.filter = JSON.stringify(this.globalFilter);
    }

    filterChange(filter: { name: string,          
            columnProp: string | number, options: string[]}, event: any) {
        //let filterValues = {}
        this.filterValues = event.target.value.trim().toLowerCase()
        this.dataSource.filter = JSON.stringify(this.filterValues)
    }
    
    customFilterPredicate() {
        const myFilterPredicate = (data: TransactionVO, filter: string): boolean => {

            let idSearch= () => {
                // 컬럼 검색
            let searchTerms = filter;
            //console.log("searchTerms"+searchTerms);
            let isFilterSet = false;
            
                if(searchTerms !== '') {
                    //console.log("실행중"+searchTerms);
                    isFilterSet = true;
                } else {
                    isFilterSet = false;
                }
            
                let found=false;
                if(isFilterSet) {
                    //console.log(data.userId)
                    if(data.userId.toString().toLowerCase().indexOf(searchTerms.slice(1, -1)) !== -1 && isFilterSet) {

                        
                        //console.log("searchTerms"+searchTerms);
                        found =true;
                        
                        //return true;
                    }
                } else {
                        found = false;
                }

                

                return found;
            
            }



            // 전체 컬럼 검색
            var globalMatch = !this.globalFilter;

            if (this.globalFilter) {
                // search all text fields
                // userId, walletId, coinId, reason, reasonDetail 통합검색
                //console.log("검색어 입력" + this.globalFilter)
                globalMatch = data.userId.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1 ||
                    data.walletId.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1 ||
                    data.coinId.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1 ||
                    data.reason.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1 ||
                    data.reasonDetail.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1;

                    if (this.fromDate && this.toDate) {
                
                        var newDate = new Date(this.toDate);
                        //console.log("Date로 형변환" + newDate)
                        let searchEndDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 59);
                        //console.log("23:59:59:999로 변경" + searchEndDate) 
                        
                        return data.regDate >= this.fromDate && data.regDate <= searchEndDate  && globalMatch ;
                    }


                return globalMatch;
            }
            //Date Range 정보가 존재하면
            //new Date()로 날짜 형식 생성하고
            //비교하기
            if (this.fromDate && this.toDate) {
                
                var newDate = new Date(this.toDate);
                //console.log("Date로 형변환" + newDate)
                let searchEndDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 59);

                //console.log("23:59:59:999로 변경" + searchEndDate) 
                let datefilter = data.regDate >= this.fromDate && data.regDate <= searchEndDate;
                
                
                

                return datefilter&& globalMatch ;
            }

            if (!globalMatch) {
                return false;
            }


            let dateSearch= () => {
                
            }

            
            

            return idSearch() ;

            
            
                
                
            //return globalMatch;
            /*
            //console.log(searchString);
            return data.userId.toString().indexOf(searchString.userId) !== -1 &&
                data.reason.toString().trim().indexOf(searchString.reason) !== -1 &&
                data.reasonDetail.toString().trim().toLowerCase().indexOf(searchString.reasonDetail.toLowerCase()) !== -1;
            */
           
            }  
        return myFilterPredicate;
    }

    /*
    resetFilters() {
        this.filterValues = {}
        this.filterSelectObj.forEach((value, key) => {
          value.modelValue = undefined;
        })
        this.dataSource.filter = "";
    }
    */
    /*
    //xml파일 불러오기
    this.http.get('assets/edu_bank_user_balance_history.xml', { responseType: 'text' }).subscribe(response => {
        //xml - >json
        let result1 = converter.xml2json(response, {compact: true, spaces: 2});
        const JSONData = JSON.parse(result1);
        console.log(JSONData['table_data']['row']);
        var test =JSONData['table_data']['row']

                     
        for (let i=0; i<test.length; i++) {
            var newItem = {
                regDate: test[i]['field'][10]['_text'],
                userId: test[i]['field'][2]['_text'],
                walletId: test[i]['field'][1]['_text'],
                gubun: test[i]['field'][3]['_text'],
                reason: test[i]['field'][8]['_text'],
                reasonDetail: test[i]['field'][9]['_text'],
                coinId: test[i]['field'][5]['_text'],
                amount: test[i]['field'][6]['_text'],
                balance: test[i]['field'][7]['_text'],
            }
            // List에 넣기
            this.transactionList.push(newItem);
        }
        this.dataSource.data = this.transactionList;
  });
  */

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    // 이전 내용
    /*
    applyFilter(searchStr: String) {
        const filterValue = searchStr;
        console.log(filterValue); //정상 작동
        console.log("trim : " + filterValue.trim());
        this.dataSource.filter = filterValue.trim();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
    }
    */

    
}









