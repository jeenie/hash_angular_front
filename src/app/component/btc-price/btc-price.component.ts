import { AfterViewInit, Component, ViewChild, OnInit, Directive, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// 날짜 조회
import { FormGroup, FormControl } from '@angular/forms';

// chart
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

import { BtcPriceVO } from './BtcPriceVo';
import { BtcPriceService } from "./BtcPriceService";
import { displayPartsToString } from 'typescript';


let data: BtcPriceVO[] = [];
@Component({
    selector: 'app-btc-price',
    templateUrl: './btc-price.component.html',
    styleUrls: ['./btc-price.component.css'],
    providers: [BtcPriceService]
})


export class BtcPriceComponent implements OnInit{
    btcPriceDataList: BtcPriceVO[];
    onlyBtcPriceDataList: BtcPriceVO[];
    onlyHssPriceDataList: BtcPriceVO[];

    displayedColumns: string[] =[
        'regDate',
        'coinId',
        'usdPrice'
    ];
    displayedColumns2: string[] =[
        'regDate',
        'coinId',
        'usdPrice',
        'netChange',
        'regulation'
    ];
    dataSource= new MatTableDataSource(data);
    dataSource2= new MatTableDataSource();
    dataSource3= new MatTableDataSource();


    //paging과 sort를 위한 객체 전달
    @ViewChild('TableOnePaginator', {static: true}) tableOnePaginator!: MatPaginator;
    @ViewChild('TableOneSort', {static: true}) tableOneSort!: MatSort;

    @ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator!: MatPaginator;
    @ViewChild('TableTwoSort', {static: true}) tableTwoSort!: MatSort;

    @ViewChild('TableThreePaginator', {static: true}) tableThreePaginator!: MatPaginator;
    @ViewChild('TableThreeSort', {static: true}) tableThreeSort!: MatSort;

    filterForm = new FormGroup({
        fromDate: new FormControl(),
        toDate: new FormControl()
    });

    get fromDate() { return this.filterForm.get('fromDate')?.value; }
    get toDate() { return this.filterForm.get('toDate')?.value; }

    dateRange = {
        fromDate: Date,
        toDate: Date
    }

    // select value
    filterValues = {};

    filterSelectObj = [
        {
            name: '코인',
            columnProp: 'coinId',
            options : ['']
        }
    ]

    // chart
    lineChartData: ChartDataSets[] = [
        { data: [85, 72, 78, 75, 77, 75], label: 'BTC' },
      ];
    
      lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
    
      lineChartOptions = {
        responsive: true,
      };
    
      lineChartColors: Color[] = [
        {
          borderColor: 'black',
          backgroundColor: 'rgba(255,255,0,0.28)',
        },
      ];
    
      lineChartLegend = true;
      lineChartPlugins = [];
      lineChartType : ChartType = 'line';;





    // constructor의 매개변수로 HTTPClient 객체 전달*****
    constructor(private BtcPriceService: BtcPriceService, private http: HttpClient) {
        this.btcPriceDataList = [];
        this.onlyBtcPriceDataList = [];
        this.onlyHssPriceDataList = [];
        this.getBtcPriceData();
    }

    ngOnInit(): void {
        

        this.dataSource.paginator = this.tableOnePaginator;
        this.dataSource.sort = this.tableOneSort;
        this.dataSource2.paginator = this.tableTwoPaginator;
        this.dataSource2.sort = this.tableTwoSort;
        this.dataSource3.paginator = this.tableThreePaginator;
        this.dataSource3.sort = this.tableThreeSort;
        

        this.filterForm.valueChanges.subscribe((filterForm) => {

            this.dateRange['fromDate'] = filterForm.fromDate;
            this.dateRange['toDate'] = filterForm.toDate;
            this.dataSource.filter = '' + Math.random();
        });

        this.dataSource.filterPredicate = this.customFilterPredicate();
    }

    getFilterObject(fullobj: BtcPriceVO[], key: string) {
        const uniqChk: string[] = [];
        //console.log("fullobj"+fullobj);
        fullobj.filter((obj) => {
            if(!uniqChk.includes(obj.coinId)) {
                uniqChk.push(obj.coinId);
            }
            
            return obj;
        });
    
        return uniqChk.sort((a: string, b: string) => {
            return (b > a ? -1: 1);
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim();
        this.dataSource2.filter = filterValue.trim().toLowerCase();
        this.dataSource3.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
    } 

    filterChange(filter: { name: string,          
        columnProp: string | number, options: string[]}, event: any) {
    //let filterValues = {}
    this.filterValues = event.target.value.trim();
    this.dataSource.filter = JSON.stringify(this.filterValues)
    console.log('filterChange'+this.dataSource.filter);
    }

    getBtcPriceData() {
        this.BtcPriceService.getJsonData().subscribe(response =>{
            //console.log("응답 데이터" + response);
            let JsonArray: any[];
            JsonArray = Object.values(response);
            //console.log("BTC응답 데이터" + JsonArray);
            
            for(let i=0; i<JsonArray.length; i++) {
                var newItem = new BtcPriceVO(JsonArray[i]['NO'], JsonArray[i]['COIN_ID'], JsonArray[i]['COIN_NAME'], JsonArray[i]['USD_PRICE'], new Date(JsonArray[i]['REG_DATE']));
                this.btcPriceDataList.push(newItem);   
            }

            // default sort
            // reg date desc
            this.btcPriceDataList.sort((a:BtcPriceVO, b: BtcPriceVO) => {
                return this.getTime(b.regDate) - this.getTime(a.regDate);
            })
            this.dataSource.data = this.btcPriceDataList;
            
            this.getOnlyBTCData();
            this.getOnlyHSSData();

            
        })
    }

    getOnlyBTCData() {
        this.onlyBtcPriceDataList = this.btcPriceDataList.filter(element => element.coinId === 'BTC');
        //console.log(this.onlyBtcPriceDataList);
        for(let index in this.onlyBtcPriceDataList)  {
            //console.log(index);
            var i: number = +index;
            if(i < this.onlyBtcPriceDataList.length - 1) {
                this.onlyBtcPriceDataList[i].netChange = this.onlyBtcPriceDataList[i].usdPrice - this.onlyBtcPriceDataList[i+1].usdPrice;
                this.onlyBtcPriceDataList[i].regulation = (this.onlyBtcPriceDataList[i].netChange / this.onlyBtcPriceDataList[i+1].usdPrice)*100;
            }
                //var z = i -1;
                //console.log(this.onlyBtcPriceDataList[i+1].usdPrice);
                
        }
      
        //console.log(this.onlyBtcPriceDataList);
        this.dataSource2.data = this.onlyBtcPriceDataList;

        let lineDate = [];
        let linePrice = [];
        for(let i=30; i >= 0; i--) {
            lineDate.push(this.getFormatDate(this.onlyBtcPriceDataList[i].regDate));
            linePrice.push(this.onlyBtcPriceDataList[i].usdPrice);
        }

        
        this.lineChartData =  [
            { data: linePrice, label: 'BTC' },
        ];

        this.lineChartLabels = lineDate
    }

    getFormatDate(date:Date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth());
        var monthStr = month >= 10? month: '0' + month;
        var day = date.getDate();
        var dayStr = day >= 10 ? day: '0' + day;
        var hour = date.getHours();
        return year + '-' + monthStr + '-' + dayStr + ' ' + hour + ':00';
    }
    getOnlyHSSData() {
        this.onlyHssPriceDataList = this.btcPriceDataList.filter(element => element.coinId === 'HSS');
        //console.log(this.onlyBtcPriceDataList);
        for(let index in this.onlyHssPriceDataList)  {
            //console.log(index);
            var i: number = +index;
            if(i < this.onlyHssPriceDataList.length - 1){
                this.onlyHssPriceDataList[i].netChange = this.onlyHssPriceDataList[i].usdPrice - this.onlyHssPriceDataList[i+1].usdPrice;
                this.onlyHssPriceDataList[i].regulation = this.onlyHssPriceDataList[i].netChange / this.onlyHssPriceDataList[i+1].usdPrice*100;
            }
                
            
        }
      
        this.dataSource3.data = this.onlyHssPriceDataList;
    }

    private getTime(date?: Date) {
        return date != null? date.getTime() : 0;
    }

    customFilterPredicate() {
        const myFilterPredicate = (data: BtcPriceVO, filter: string): boolean => {
                        
            let coinSelectSearch= () => {
                // 컬럼 검색
            let searchTerms = this.filterValues;
            console.log("searchTerms"+searchTerms);
            let isFilterSet = false;
            
                if(searchTerms !== '') {
                    console.log("실행중"+searchTerms);
                    isFilterSet = true;
                } else {
                    isFilterSet = false;
                }
            
                let found=false;
                if(this.filterValues) {
                    console.log("true")
                    if(data.coinId.toString().indexOf(this.filterValues.toString().slice(1, -1)) !== -1 && isFilterSet) {
                        console.log("true")
                        found =true;
                        
                    }
                } else {
                        found = false;
                }
                return found;
            }

            if (this.fromDate && this.toDate) {
                var newDate = new Date(this.toDate);

                let searchEndDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 59);
                let datefilter = data.regDate >= this.fromDate && data.regDate <= searchEndDate;
                return datefilter && coinSelectSearch();
            }

            
            return coinSelectSearch(); 
        }
        return myFilterPredicate;
    }


}