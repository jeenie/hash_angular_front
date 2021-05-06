import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempUserInfoStorageService {
  REC_USER: string;//추천인 아이디
  REC_NAME: string;//추천인 이름
  REC_DIR: string;//위치
  pair: boolean;
  PARENT_USER: string;//부모 아이디

  constructor() {
    this.REC_USER = "";
    this.REC_NAME = "";
    this.REC_DIR = "";
    this.pair = true;
    this.PARENT_USER = "";
  }
}
