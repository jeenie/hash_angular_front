import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as converter from 'xml-js';


@Injectable()
export class UserRewardService{

    //data_User_info data.cvs 에 맞는 vo 
    //bankUserInfo ?:bankUserInfoVO[];
    //jsonData?:string ;


    //2. http Httpclient 생성자에 주입
    constructor(private http_c : HttpClient){
    }

   getUserInfoJson() {
       return this.http_c.get('http://localhost:3000/api/userinfo2', { headers: new HttpHeaders()
       .append('Access-Control-Allow-Methods', 'get')
       .append('Access-Control-Allow-Origin', 'http://localhost:3000/api/userinfo2')
       .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
       responseType:"json" } );
   }

   getUserProductJson() {
        return this.http_c.get('http://localhost:3000/api/product', { headers: new HttpHeaders()
        .append('Access-Control-Allow-Methods', 'get')
        .append('Access-Control-Allow-Origin', 'http://localhost:3000/api/product')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType:"json" } );
   }

   getUserBalanceJson() {
       return this.http_c.get('http://localhost:3000/api/userBalance', { headers: new HttpHeaders()
       .append('Access-Control-Allow-Methods', 'get')
       .append('Access-Control-Allow-Origin', 'http://localhost:3000/api/userBalance')
       .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
       responseType:"json" } );
   }
}
