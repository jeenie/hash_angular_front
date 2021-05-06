import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TempUserInfoStorageService } from 'src/app/service/temp-user-info-storage.service';

@Component({
  selector: 'app-tree-detail',
  templateUrl: './tree-detail.component.html',
  styleUrls: ['./tree-detail.component.css']
})
export class TreeDetailComponent implements OnInit {
  @Input() selectNodeObj: any

  secDir: string;

  constructor(private router: Router, private tempStorage: TempUserInfoStorageService) {
    this.secDir = "L"
  }

  ngOnInit(): void {
  }

  /*
    * 유저 디테일에서 멤버 추가 기능 제외 예정

  checkDir() {
    console.log(this.selectNodeObj)
    if (this.secDir === "L" && this.selectNodeObj.USER_L == undefined) {
      this.recInfoService.loginUserObj = this.loginUserObj;
      this.recInfoService.selectNodeObj = this.selectNodeObj;
      this.recInfoService.rec_dir = this.secDir;
      this.router.navigate(['/com/marketing/addMember'])

    } else if (this.secDir === "R" && this.selectNodeObj.USER_R == undefined) {
      this.recInfoService.loginUserObj = this.loginUserObj;
      this.recInfoService.selectNodeObj = this.selectNodeObj;
      this.recInfoService.rec_dir = this.secDir;
      this.router.navigate(['/com/marketing/addMember'])
    } else {
      alert("이미 멤버가 존재합니다.")
    }
  }
*/

  clickAddMember() {
    // this.checkDir()
  }
  


}
