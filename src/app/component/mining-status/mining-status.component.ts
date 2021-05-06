import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';



//import { MiningStatusVO } from './MiningStatusVo';
import { HttpClient } from '@angular/common/http';


import * as converter from 'xml-js';
import { MiningStatusVO } from './MiningStatusVo';


  
  let data: MiningStatusVO[] = [
      
  ];



@Component({
    selector: 'app-table',
    templateUrl:'./mining-status.component.html',
    styleUrls: ['./mining-status.component.css']
})


export class MiningStatusComponent implements AfterViewInit {
    miningStatusList: MiningStatusVO[];
    //miningStatusList!: MiningStatusVO[];

    //컬럼
    displayedColumns: string[] = [
                                    'productCode', 
                                    'productName', 
                                    'ths', 
                                    'productType',
                                    'productStatus',
                                    'purchaseDate',
                                    'approvalDate',
                                    'operationDate'
                                ];
    // paging, sorting, filtering을 위한 dataSource --> MatTableDataSource
    dataSource= new MatTableDataSource(data);
    

    
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    
    //data: any;
    //statusList: any;

    constructor(private http: HttpClient) {
        this.miningStatusList=[];
        //xml파일 불러오기
        this.http.get('assets/miningStatus.xml', { responseType: 'text' }).subscribe(response => {
            //xml - >json
            let result1 = converter.xml2json(response, {compact: true, spaces: 2});
            const JSONData = JSON.parse(result1);
            console.log(JSONData['miningStatusList']['miningStatus']);
            var test =JSONData['miningStatusList']['miningStatus']

            //vo 구조에 맞게 parsing
            for (let i=0; i<test.length; i++){
                var newItem = {
                    productCode : test[i]['productCode']['_text'],
                    productName : test[i]['productName']['_text'],
                    ths: test[i]['ths']['_text'],
                    productType: test[i]['productType']['_text'],
                    productStatus: test[i]['productStatus']['_text'],
                    purchaseDate: test[i]['purchaseDate']['_text'],
                    approvalDate: test[i]['approvalDate']['_text'],
                    operationDate: test[i]['operationDate']['_text']                       
            }
            //List에 넣기
            this.miningStatusList.push(newItem);
            
        }
        this.dataSource.data = this.miningStatusList;
        this.dataSource.filteredData = this.miningStatusList

        console.log(this.dataSource);
        
      });

      
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
    }

    
}

    







