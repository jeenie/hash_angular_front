import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  ChartSelectionChangedEvent,
  ChartType,
  Column,
} from 'angular-google-charts';

import { UserInfoService } from 'src/app/service/user-info.service';
import { UserInfoVO } from 'src/app/component/UserInfoVO';

import { TempUserInfoStorageService } from 'src/app/service/temp-user-info-storage.service';

@Component({
  selector: 'app-binary-tree',
  templateUrl: './binary-tree.component.html',
  styleUrls: ['./binary-tree.component.css']
})
export class BinaryTreeComponent implements OnInit {

  userInfoList: UserInfoVO[];  //전체 유저 정보 목록

  selectNodeObj: UserInfoVO | any; //선택한 노드 객체 == 상세 컴포넌트 데이터

  treeUserList: UserInfoVO[];  //트리에 그려진 유저 목록
  loginUserId: string = 'min9103';  //로그인한 유저 아이디
  loginUserObj: UserInfoVO | any;  //로그인한 유저 객체
  tableUserList: UserInfoVO[];

  loginUserInput: string;

  constructor(private router: Router, private userInfoService: UserInfoService, private tempStorage: TempUserInfoStorageService) {
    this.userInfoList = [];
    this.selectNodeObj = new UserInfoVO();
    this.treeUserList = [];
    this.tableUserList = [];

    this.loginUserInput = this.loginUserId;
  }

  ngOnInit(): void {
    this.userInfoService.getUserInfos().subscribe(response => {  //데이터 호출
      this.userInfoList = response;
      this.createBinaryTree();
    });
  }

  //트리 생성 부분
  title = '바이너리 트리';
  type = ChartType.OrgChart;
  data: any = [
    ['USER_ID', 'REC_ID']
  ]
  chartColumns = ["USER_ID", "REC_ID"];
  options = {
    allowHtml: true,
    nodeClass: 'treeNodeClass',
    selectedNodeClass: 'selectedTreeNodeClass',
  }


  //노드를 선택 이벤트
  //디테일에 표시될 selectNodeObj에 저장
  public selectNode(event: ChartSelectionChangedEvent) {
    let selectedNodeRow;  //선택한 노드 열번호
    let selectedNode;  //선택한 노드
    let selectedUserId: any;  //선택한 노드 아이디

    if (event.selection[0] != null) {  //선택 했을 때
      selectedNodeRow = event.selection[0].row || 0;
      selectedNode = this.data[selectedNodeRow];

      selectedUserId = selectedNode[0].v;

      this.tableUserList = [];

      //트리의 멤버 추가를 선택했을 때 이벤트
      if (selectedUserId.search("!") == 1) {
        let confirm_result = confirm("멤버를 추가하시겠습니까?")

        if (confirm_result) {
          let data = selectedUserId.split("!");  //데이터 가공(위치, 부모유저)

          //멤버추가 페이지의 필요한 정보를 서비스에 저장
          this.tempStorage.REC_USER = this.loginUserId;
          this.tempStorage.REC_NAME = this.loginUserObj.USER_NAME;
          this.tempStorage.REC_DIR = data[0];
          this.tempStorage.PARENT_USER = data[1];

          //USER_DIR R/L 선택가능여부
          let p = this.treeUserList.find((element: any) => element.USER_ID == data[1]) || new UserInfoVO();
          this.tempStorage.pair = p.USER_R == "\\n" && p.USER_L == "\\n";

          this.router.navigate(['/com/marketing/addMember'])  //이동
        }
        this.selectNodeObj = new UserInfoVO();


      } else {
        this.selectNodeObj = this.treeUserList.find((element: any) => element.USER_ID == selectedUserId);

        this.addTableUserListData(selectedUserId); // tree-table 그리는 리스트
        this.tableUserList.shift();
      }

    } else {
      this.selectNodeObj = new UserInfoVO();
      this.tableUserList = [];
    }
  }

  //tree-table을 위한 선택한 노드의 자식 노드들 tableUserList에 저장
  //USER_ID의 왼쪽, 오른쪽 노드 데이터 추가 & 재귀 호출
  addTableUserListData(USER_ID: string) {

    let paramUserObj: UserInfoVO | any = this.treeUserList.find(element => element.USER_ID == USER_ID);
    this.tableUserList.push(paramUserObj)

    var USER_L = paramUserObj.USER_L;
    var USER_R = paramUserObj.USER_R;

    //왼쪽자식관련 시작
    if (USER_L == "\\n") {
      if (USER_R == "\\n")
        return;
    }
    else this.addTableUserListData(USER_L)
    //왼쪽 자식 끝


    //오른쪽 자식 관련 시작
    if (USER_R == "\\n") return;
    this.addTableUserListData(USER_R)
    //오른쪽 자식 끝
  }

  /*
   * 바이너리 트리 생성 메소드 구현
   * 작성자: 정은애
   * 작성일: 2020.12.09.
   */

  createNodeHtml(USER_ID: string): string {
    return `<div class="pb-2">
      <img class="mb-1" src="assets/node.png" /><br>
      <span class="p-1" style="border: 2px solid rgb(165, 181, 198);border-radius: 10px;">`+ USER_ID + `</span>
    </div>`
  }

  createAddMemHtml() {
    return `<img src="assets/plus.ico" />`
  }

  //로그인한 유저(루트) 데이터 추가 & 재귀 메소드 호출
  createBinaryTree() {
    this.data = [];
    this.treeUserList = [];

    this.loginUserObj = this.userInfoList.find(element => element.USER_ID == this.loginUserId);
    if (this.loginUserObj == undefined) return;  //없는 사용자


    this.data.push([{ v: this.loginUserId, f: this.createNodeHtml(this.loginUserId) }, ''])

    this.addBinaryTreeData(this.loginUserId)

    console.dir(this.treeUserList)
  }

  //USER_ID의 왼쪽, 오른쪽 노드 데이터 추가 & 재귀 호출
  addBinaryTreeData(USER_ID: string) {

    let paramUserObj: UserInfoVO | any = this.userInfoList.find(element => element.USER_ID == USER_ID);
    this.treeUserList.push(paramUserObj)

    var USER_L = paramUserObj.USER_L;
    var USER_R = paramUserObj.USER_R;

    //왼쪽자식관련 시작
    if (USER_L == "\\n") { //끝에 + 삽입
      this.data.push([{ v: 'L!' + USER_ID, f: this.createAddMemHtml() }, USER_ID])
      if (USER_R == "\\n")
        return
    } else {
      this.data.push([{ v: USER_L, f: this.createNodeHtml(USER_L) }, USER_ID])
      this.addBinaryTreeData(USER_L)
      //왼쪽 자식 끝
    }

    //오른쪽 자식 관련 시작
    if (USER_R == "\\n") { //끝에 + 삽입
      this.data.push([{ v: 'R!' + USER_ID, f: this.createAddMemHtml() }, USER_ID])
      return
    } else {

      this.data.push([{ v: USER_R, f: this.createNodeHtml(USER_R) }, USER_ID])
      this.addBinaryTreeData(USER_R)
      //오른쪽 자식 끝
    }
  }

  changeLoginUser() {
    if(this.userInfoList.find(element => element.USER_ID == this.loginUserInput) != undefined) {
      this.loginUserId = this.loginUserInput;
      this.createBinaryTree();
      this.tableUserList = [];
    }else {
      alert("없는 사용자입니다.")
    }
  }

  // //노드 삭제 (단, 단말노드만)
  // deleteSelectedNode() {
  //   //단말노드인지 검사
  //   console.log(this.selectNodeObj.USER_L=="\\n" && this.selectNodeObj.USER_R=="\\n")
  //   //해당 유저 제거

  //   //부모 유저의 자식 제거
  //   console.log(this.selectNodeObj);
  // }

}
