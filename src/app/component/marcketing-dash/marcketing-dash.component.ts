
import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
//chartBar - 1.chart.js import
import { ChartDataSets, ChartType, ChartOptions, AngleLineOptions } from 'chart.js';
//chartBar - 2.ng2-chart import
import { Label } from 'ng2-charts';
import { bankUserInfoVO } from './bankUserInfoVO';
//Service - service 주입
import { CovidService } from "./covid.service";
//공통 - xml-js import
import * as converter from 'xml-js';


import { FileSaverModule,FileSaverService } from 'ngx-filesaver';
// import multer from "multer"
import { saveAs } from 'file-saver';
import { faThList } from '@fortawesome/free-solid-svg-icons';
import { timeHours } from 'd3';





@Component({
  selector: 'app-marcketing-dash',
  templateUrl: './marcketing-dash.component.html',
  styleUrls: ['./marcketing-dash.component.css'],
  providers: [CovidService]
})
export class MarcketingDashComponent implements OnInit {

  userInfoData: bankUserInfoVO[];
  private cnData:any =[];

  /** Bar Char Info **/
  // charBar - Bar차트 꾸미기 
  
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: Label[] = ['CL001', 'CL002', 'CL003', 'CL007', 'CL012', 'CL015','CL019','CL021'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  public chartColors: Array<any> = [
    { 
      backgroundColor: ['#FFB6C1', '#6495ED', '#006400', '#008B8B','#ADD8E6','#2F4F4F','#FF1493','#CD5C5C'],
    }
]
barChartData: ChartDataSets[] = [
    { data:  this.cnData, label: '국가별 사용자 수' },
  ];






 //Service - 생성자에 주입
  constructor(private CovidService: CovidService, private _FileSaverService: FileSaverService) {
    this.userInfoData = []; 
  }


  
  ngOnInit(): void {
    ///Service - xml 파일 불러오기 
    this.CovidService.getxml_bankUserInfo();
    this.getCNData();
    this.getCsvToXml();
  }

   /*** CN data Parsing  ***/
    //국가별 수대로 count
    /*
        구조
        {"CN:"국가" , "num":"해당 데이터 수"}
        
    */
   getCNData() {

    let JsonArray:any[];
    let CNArray:any[] = [];
    var count:any = [];

    //Service - get file and Parser XML to Json
    this.CovidService.getxml_bankUserInfo().subscribe(response=>{

    //UserInfo_Data : xml - >json
    let result1 = converter.xml2json(response, {compact: true, spaces: 2});
    const JSONData = JSON.parse(result1);
    console.log(JSONData);

    
    JsonArray = JSONData["BankUserInfoList"]['BankUserInfo'];

    for(let i=0; i<JsonArray.length; i++){
        //CNData : 각 유저별로 분리
        let data = JsonArray[i]['USER_PHONE_CN']
        CNArray.push(data['_text']);
               
    }
    

    //CNData : get count ecch country
    CNArray.forEach(function(i){count[i]=(count[i]||0) + 1});
    this.setCntCN(count);
    console.log(count);
    
})
   
}

//ChartBar -  Array for 차트 Data
setCntCN(count:any){

    this.cnData.push(parseInt(count['CL001']))
    this.cnData.push(parseInt(count['CL002']))
    this.cnData.push(parseInt(count['CL003']))
    this.cnData.push(parseInt(count['CL007']))
    this.cnData.push(parseInt(count['CL012']))
    this.cnData.push(parseInt(count['CL015']))
    this.cnData.push(parseInt(count['CL019']))
    this.cnData.push(parseInt(count["CL021"]))

}


  /*
   cvs -> xml
  */
 getCsvToXml() {

  this.CovidService.getCSVData().subscribe(response=>{
    
    //remove Double quote
    let csvData = response.replace(/\"/g, "");

    let newData: Array<any>;
  
    newData = csvData.split('\n').map(row => row.trim())
  
    let headings = newData[0].split(',')
  
    let xml ="<BankUserInfoList>\n"
  
    for (let i = 1; i < newData.length; i++) {
      let details = newData[i].split(',');
      
      xml += "<BankUserInfo>\n"
      for (let j = 0; j < headings.length; j++) {
        xml += `<${headings[j]}>${details[j]}</${headings[j]}>
        `;
      }
      xml += "</BankUserInfo>\n"
    }
    xml+="</BankUserInfoList>\n"
    // console.log(xml)
    this.CovidService.addHero(xml)
    .subscribe(response=>{
      console.log(response)
    })
  
  });
 

}


} 



