
import { Injectable } from '@angular/core';
//1. http Client Import
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { bankUserInfoVO } from './bankUserInfoVO';
import * as converter from 'xml-js';


@Injectable()
export class CovidService{

    //data_User_info data.cvs 에 맞는 vo 
    bankUserInfo ?:bankUserInfoVO[];


    //2. http Httpclient 생성자에 주입
    constructor(private http_c : HttpClient){
    }


    /***  bank_user_info xml  ***/
    getxml_bankUserInfo(){
        //xml파일 불러오기
        return this.http_c.get('assets/blob.xml', { responseType: 'text' });       
    }


    
    /**
     * 파일 접근
     */
    getCSVData(){
        //csv 파일 불러오기
       return this.http_c.get('assets/edu_bank_user_info.csv', { responseType: 'text' });

   }

//    setCsvtoXml(){
//     return this.http_c.post('assets/edu_bank_user_info.csv', { responseType: 'text' });
//    }

addHero(hero: string){
    const body = {name: 'Brad'};

    const newfile = new Blob([hero], {
        type: 'application/xml',
        endings: 'native'
    });

    var formData = new FormData();
    var user_data_info = new Blob([hero], { type: "text/xml"});
    formData.append('xmldata',user_data_info);

    return this.http_c
    .get('http://192.168.200.121:3000/api/BTCquote',{
         headers: new HttpHeaders()
        .append('Access-Control-Allow-Methods', 'get')
        .append('Access-Control-Allow-Origin', 'http://192.168.200.121:3000/api/BTCquote')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType:"text"
     }) 

  }



  



}
