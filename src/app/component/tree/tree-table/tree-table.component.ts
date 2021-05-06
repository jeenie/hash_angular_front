import { OnChanges, AfterViewInit, Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserInfoVO } from 'src/app/component/UserInfoVO';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.css']
})
export class TreeTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tableUserList: UserInfoVO[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['USER_ID', 'USER_NAME', 'REC_DIR', 'GOODS_NAME', 'POSITION', 'REG_DATE'];
  dataSource: any;

  constructor() {
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void  {
    this.dataSource = new MatTableDataSource<UserInfoVO>(this.tableUserList);
  }

  ngOnChanges() { //@Input 값이 변경 되었을 때 호출
    this.dataSource = new MatTableDataSource<UserInfoVO>(this.tableUserList);  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;  
  }

}
