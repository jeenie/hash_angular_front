import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as converter from 'xml-js';


@Injectable()
export class BtcPriceService{

    //data_User_info data.cvs 에 맞는 vo 
    //bankUserInfo ?:bankUserInfoVO[];
    //jsonData?:string ;


    //2. http Httpclient 생성자에 주입
    constructor(private http_c : HttpClient){
    }
    
    /*
    getJson_bankUserInfo() {
        return this.http_c.post('http://localhost:3000/xmldata', {
            headers: new HttpHeaders()
           .append('Access-Control-Allow-Methods', 'POST')
           .append('Access-Control-Allow-Origin', 'http://localhost:3000/xmldata')
           .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
           responseType:"json"
        })
    }
*/

   getJsonData() {
       return this.http_c.get('http://localhost:3000/api/btc', { headers: new HttpHeaders()
       .append('Access-Control-Allow-Methods', 'get')
       .append('Access-Control-Allow-Origin', 'http://localhost:3000/api/btc')
       .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
       responseType:"json" } );
   }

//    setCsvtoXml(){
//     return this.http_c.post('assets/edu_bank_user_info.csv', { responseType: 'text' });
//    }





  



}
