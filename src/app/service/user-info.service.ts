import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInfoVO } from 'src/app/component/UserInfoVO';

// Set the http options
// const headers = new HttpHeaders()

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private URL = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getUserInfos(): Observable<UserInfoVO[]> {
    return this.http.get<UserInfoVO[]>(this.URL + "userInfos");
  }

  addUserInfo(userInfo: UserInfoVO): Observable<any> {
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(userInfo);
    // console.log(body);
    return this.http.post<UserInfoVO>(this.URL + "userInfo", body, { 'headers': headers, observe: 'response' })
  }

  updateChildUserInfo(USER_ID: string, DIR: string, CHILD_ID: string): Observable<any> {
    const headers = { "Content-Type": "application/json" };
    console.log("angular" +USER_ID+" "+DIR+" "+CHILD_ID)
    return this.http.put<any>(this.URL+"userInfo/"+USER_ID, {"DIR":DIR, "CHILD_ID":CHILD_ID}, { 'headers': headers, observe: 'response' })
  }

  //아이디 중복 검사
  idOverlapCheck(USER_ID: string): Observable<any> {
    return this.http.get<any>(this.URL + "idOverlabCheck/"+USER_ID, { observe: 'response' })
  }

  checkEmail(EMAIL: string, EMAIL_CODE: string): Observable<any> {
    return this.http.post<any>(this.URL + "checkEmail", { "EMAIL":EMAIL, "EMAIL_CODE":EMAIL_CODE }, { observe: 'response' })
  }

}
