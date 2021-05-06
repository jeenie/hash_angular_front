import { Injectable } from '@angular/core';
//1. http Client Import
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { bankUserBalanceHistoryVO } from '../model/bankUserBalanceHistoryVO';
import * as converter from 'xml-js';
import { HSSquoteVO } from '../model/HSSquoteVO';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class RestfulService{

    //data_User_info data.cvs 에 맞는 vo 
    bankUserInfo ?:bankUserBalanceHistoryVO[];


    //2. http Httpclient 생성자에 주입
    constructor(private http_c : HttpClient){
    }

    
 
// public getPosts(path: string): Observable<bankUserBalanceHistoryVO[]>{
//     let basePath = 'http://127.0.0.1:3000/api/'
//     return this.http_c.get<bankUserBalanceHistoryVO[]>(basePath + path,{headers: new HttpHeaders()
//         .append('Access-Control-Allow-Methods', 'get')
//         .append('Access-Control-Allow-Origin', basePath + path)
//         .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
//         responseType:"json"});
// }

public httpGet(path: string): Observable<bankUserBalanceHistoryVO[]>{
    let basePath = 'http://127.0.0.1:3000/api/'
    return this.http_c.get<bankUserBalanceHistoryVO[]>(basePath + path,{
        headers: new HttpHeaders()
        .append('Access-Control-Allow-Methods', 'get')
        .append('Access-Control-Allow-Origin', basePath + path)
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType:"json"
    });

  }

  httpPost(path:string,data:any){
    console.log(data);
    let basePath = 'http://127.0.0.1:3000/api/'
    return this.http_c
    .post(basePath + path,data,{
         headers: new HttpHeaders()
        .append('Access-Control-Allow-Methods', 'post')
        .append('Access-Control-Allow-Origin', basePath + path)
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType:"json"
     }) 

  }

  httpPut(path:string,data:any){
    let basePath = 'http://127.0.0.1:3000/api/'
    return this.http_c
    .put(basePath + path,data,{
         headers: new HttpHeaders()
        .append('Access-Control-Allow-Methods', 'put')
        .append('Access-Control-Allow-Origin', basePath + path)
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType:"json"
     }) 

  }

  httpDelete(path:string){
    let basePath = 'http://127.0.0.1:3000/api/'
    return this.http_c
    .delete(basePath + path,{
      headers: new HttpHeaders()
        .append('Access-Control-Allow-Methods', 'delete')
        .append('Access-Control-Allow-Origin', basePath + path)
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType:"json"
    });
  }





}
