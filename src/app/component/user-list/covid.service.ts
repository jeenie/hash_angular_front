import { Injectable } from '@angular/core';
//1. http Client Import
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { bankUserInfoVO } from './user';


@Injectable()
export class CovidService{

    


    //2. http Httpclient 생성자에 주입
    constructor(private http_c : HttpClient){
    }
    


   getJsonData() {
    return this.http_c.get('http://localhost:3000/api/userinfo', { headers: new HttpHeaders()
    .append('Access-Control-Allow-Methods', 'get')
    .append('Access-Control-Allow-Origin', 'http://localhost:3000/api/userinfo')
    .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
    responseType:"json" } );
       
   }

   updateUserInfo(userID: string, updateData: string, column: string)  {
    console.log(updateData);
    console.log(userID);
    console.log(column);
    console.log('4545요청');
    return this.http_c.post('http://localhost:3000/api/updateUserInfo', {userID: userID, updateData: updateData, column:column}, { headers: new HttpHeaders()
    .append('Access-Control-Allow-Methods', 'post')
    .append('Access-Control-Allow-Origin', 'http://localhost:3000/api/updateUserInfo')
    .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method")
    .append('Content-Type', 'application/json'),
    responseType:"json" })
    
   }

}
