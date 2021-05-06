import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoVO } from 'src/app/component/UserInfoVO';

import { TempUserInfoStorageService } from 'src/app/service/temp-user-info-storage.service';
import { UserInfoService } from 'src/app/service/user-info.service';


@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  member: UserInfoVO;
  REC_NAME: string;
  PARENT_USER: string;
  USER_PW_RE: string;
  pair: boolean;

  EMAIL_CODE: string;
  EMAIL_CODE_INPUT: string
  EMAIL_CHECK: boolean;
  USER_ID_CHECK: boolean;

  message: string;

  constructor(private router: Router, private tempStorage: TempUserInfoStorageService, private userInfoService: UserInfoService) {
    this.member = new UserInfoVO();
    this.member.REC_USER = tempStorage.REC_USER;
    this.member.REC_DIR = tempStorage.REC_DIR;
    this.pair = tempStorage.pair;

    this.REC_NAME = tempStorage.REC_NAME;
    this.PARENT_USER = tempStorage.PARENT_USER;
    this.USER_PW_RE = "";

    this.EMAIL_CODE = "";
    this.EMAIL_CODE_INPUT = "";
    this.EMAIL_CHECK = false;
    this.USER_ID_CHECK = false;

    this.message = "";
  }

  ngOnInit(): void { }

  submitButton() {
    console.log(this.member);
    this.message = this.validation();
    if (this.message.length != 0) {
      alert(this.message);
    }
    this.userInfoService.addUserInfo(this.member).subscribe(response => {
      console.log(response.status)
      this.userInfoService.updateChildUserInfo(this.PARENT_USER, this.member.REC_DIR, this.member.USER_ID).subscribe((response) => {
        console.log(response.status)
        this.router.navigate(['/com/marketing/binaryTree']);
      });

    });
  }

  checkEmail() {
    if (this.member.USER_EMAIL.trim().length == 0) {
      alert("이메일을 입력해주십시오.")
    }
    else {
      this.EMAIL_CODE = Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log(this.EMAIL_CODE)
      this.userInfoService.checkEmail(this.member.USER_EMAIL, this.EMAIL_CODE).subscribe(response => {
        console.log(response)
        alert("이메일이 전송되었습니다.")
      })
    }
  }

  checkEmailCode() {
    if (this.EMAIL_CODE == this.EMAIL_CODE_INPUT) {
      this.EMAIL_CHECK = true;
      alert("이메일 인증이 완료되었습니다.")
    } else {
      this.EMAIL_CODE_INPUT = "";
      alert("잘못된 인증 코드입니다.")
    }
  }

  checkUserId() {
    this.userInfoService.idOverlapCheck(this.member.USER_ID).subscribe(response => {
      if (response.body.length == 0) {
        this.USER_ID_CHECK = true;
        alert("사용가능한 아이디입니다.");
      }
      else {
        alert("이미 사용 중인 아이디입니다.");
        this.member.USER_ID = ""
      }

    })
  }

  validation() {
    if (this.member.USER_NAME.length == 0) {
      return "이름을 입력해주십시오."
    }

    // var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (this.member.USER_EMAIL.length == 0) {
      return "이메일을 입력해주십시오."
    }

    if (this.EMAIL_CHECK == false) {
      return "이메일 인증을 해주십시오."
    }

    if (this.member.USER_PHONE.length == 0) {
      return "연락처 입력해주십시오."
    }

    // var re = /[a-z0-9()]{5,12}/
    if (this.member.USER_ID.length == 0) {
      return "아이디를 입력해주십시오."
    }

    if (this.USER_ID_CHECK == false) {
      return "아이디 중복확인을 해주십시오."
    }

    if (this.member.USER_PW.length == 0) {
      return "패스워드를 입력해주십시오."
    }

    if (this.member.USER_PW != this.USER_PW_RE) {
      return "패스워드가 일치하지 않습니다."
    }

    return "";

  }
}
