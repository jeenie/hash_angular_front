import { Component, OnInit } from '@angular/core';
import { miningHistoryVO } from './miningHistoryVO';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import * as converter from 'xml-js';

@Component({
    selector: 'app-table',
    templateUrl:'./table.component.html',
    styleUrls: ['./table.component.css']
})


export class TableComponent implements OnInit {


    miningHistoryList :miningHistoryVO[];
   
    
    constructor( private http: HttpClient) {
        this.miningHistoryList=[];
        this.getMiningHistory();
    }

    ngOnInit(): void {
        
    }

    getMiningHistory(){
        //xml파일 불러오기
        this.http.get('assets/data.xml', { responseType: 'text' }).subscribe(response => {
                //xml - >json
                let result1 = converter.xml2json(response, {compact: true, spaces: 2});
                const JSONData = JSON.parse(result1);
                console.log(JSONData['miningHistoryList']['miningHistory']);
                var test =JSONData['miningHistoryList']['miningHistory']

                //vo 구조에 맞게 parsing
                for (let i=0; i<test.length; i++){
                    var newItem = {
                        productCode : test[i]['productCode']['_text'],
                        amount: test[i]['amount']['_text'],
                        usd: test[i]['usd']['_text'],
                        type : test[i]['type']['_text'],
                        date : test[i]['date']['_text']
                       
                }
                //List에 넣기
                this.miningHistoryList.push(newItem);

            }

          });
    }
    
    
}




