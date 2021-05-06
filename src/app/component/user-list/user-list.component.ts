import { AfterViewInit, Component, ViewChild, OnInit, Directive, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';


import { bankUserInfoVO } from './user';
import { CovidService } from "./covid.service";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

let data: bankUserInfoVO[] = [];

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css'],
    providers: [CovidService],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})


export class UserListComponent implements OnInit{
    isEditMode = false;
    userInfoList: bankUserInfoVO[];
    displayedColumns: string[] = [
        'USER_ID',
        'USER_NAME',
        'USER_EMAIL',
        'USER_PHONE',
        'REC_USER',
        'REC_DIR',
        'USER_L',
        'USER_R'
    ];
    dataSource = new MatTableDataSource(data);
    expandedElement: bankUserInfoVO | null | undefined;

    model: bankUserInfoVO | undefined;
    userInfoControl: FormGroup;

    // 전체 통합 검색
    globalFilter = '';
    
    filteredValues = {
        USER_ID: ''
    }

    //paging과 sort를 위한 객체 전달
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // constructor의 매개변수로 HTTPClient 객체 전달*****
    constructor(private CovidService: CovidService, fb:FormBuilder, private http: HttpClient) {
        this.userInfoList = [];
        this.userInfoControl = fb.group({
            userEmail: '',
            userPhone: ''
        })
    }



    get userEmail() { return this.userInfoControl.get('userEmail')?.value }
    get userPhone() { return this.userInfoControl.get('userPhone')?.value }


    ngOnInit(): void {
        this.getUserList();
        
        
        this.dataSource.filterPredicate = this.customFilterPredicate();
    }

    applyFilter(filter: string) {
        this.globalFilter = filter;
        // dataSource의 filter 에 검색할 컬럼정보 넣기
        this.dataSource.filter = JSON.stringify(this.filteredValues);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getUserList() {
        this.CovidService.getJsonData().subscribe(response =>{
            
            let JsonArray: any[];
            JsonArray = Object.values(response);
            //console.log("USER응답 데이터" + JsonArray);
            for(let i=0; i<JsonArray.length; i++) {
                
                var newItem = new bankUserInfoVO(JsonArray[i]['USER_ID'], JsonArray[i]['USER_NAME'], JsonArray[i]['USER_PHONE'], JsonArray[i]['USER_EMAIL'], JsonArray[i]['USER_PHONE_CN'], JsonArray[i]['REC_USER'], JsonArray[i]['REC_DIR'], JsonArray[i]['USER_L'], JsonArray[i]['USER_R'], JsonArray[i]['REG_DATE']);
                this.userInfoList.push(newItem);
            }
            //console.log('User 리스트'+this.userInfoList);
            this.dataSource.data = this.userInfoList;

            
            //console.log(this.dataSource);
        })
    }


    customFilterPredicate() {
        const myFilterPredicate = (data: bankUserInfoVO, filter: string): boolean => {
            // 전체 컬럼 검색
            var globalMatch = !this.globalFilter;

            if (this.globalFilter) {
                // search all text fields
                // userId, walletId, coinId, reason, reasonDetail 통합검색
                console.log("검색어 입력" + this.globalFilter)
                return globalMatch = data.USER_ID.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1 
                || data.USER_NAME.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1
                || data.USER_EMAIL.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1
                || data.USER_PHONE.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1;

            }


            if (!globalMatch) {
                return false;
            }
            return false;
        }
        return myFilterPredicate;
    }

    changeEditMode(user: bankUserInfoVO) {
        this.isEditMode=true;
        this.userInfoControl.get('userEmail')?.setValue(user.USER_EMAIL);
        this.userInfoControl.get('userPhone')?.setValue(user.USER_PHONE);
        this.model = user;
        //console.log(this.model);
    }

    saveUserInfo(event: Event, user:bankUserInfoVO) {
        //console.log(index);
        this.isEditMode=false;
        this.model = user;
        this.model.USER_EMAIL = this.userEmail.toString();
        this.CovidService.updateUserInfo(this.model.USER_ID, this.model.USER_EMAIL, 'EMAIL').subscribe(response => {
            console.log(response);
        });
        //this.CovidService.updateUserInfo();
        //console.log(this.userInfoList);
    }

    

    /*
    customFilterPredicate() {
        const myFilterPredicate = (data: bankUserInfoVO, filter: string): boolean => {
            // 전체 컬럼 검색
            var globalMatch = !this.globalFilter;

            if (this.globalFilter) {
                // search all text fields
                // userId, walletId, coinId, reason, reasonDetail 통합검색
                console.log("검색어 입력" + this.globalFilter)
                globalMatch = data.USER_ID.toString().trim().indexOf(this.globalFilter.toString().trim()) !== -1;

            }

            

            if (!globalMatch) {
                return false;
            }
            // 컬럼 검색
            let searchString = JSON.parse(filter);
            //console.log(searchString);
            return data.USER_ID.toString().indexOf(searchString.userId) !== -1 
        }
        return myFilterPredicate;
    }
    */

}

/*
convertCsvToXml() {

        this.CovidService.getCSVData().subscribe(response=>{
          
          //remove Double quote
          let csvData = response.replace(/\"/g, "");
      
          let newData: Array<any>;
        
          newData = csvData.split('\n').map(row => row.trim())
        
          let headings = newData[0].split(',')
        
          let xml ="<BankUserInfoList>\n"
        
          for (let i = 1; i < newData.length; i++) {
            let details = newData[i].split(',');
            
            xml += "<BankUserInfo>\n"
            //console.log("?"+headings.length);
            for (let j = 0; j < headings.length; j++) {
              xml += `<${headings[j]}>${details[j]}</${headings[j]}>
              `;
            }
            xml += "</BankUserInfo>\n"
          }
          xml+="</BankUserInfoList>\n"
          //console.log(xml)
          
          
          
        });
       
      
    }
*/