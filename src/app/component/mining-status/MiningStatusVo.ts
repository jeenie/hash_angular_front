import { StringLiteral } from 'typescript';

export class MiningStatusVO {
    productCode:String;
    productName: String;
    ths: String;
    productType : String;
    productStatus: String;
    purchaseDate: String;
    approvalDate: String;
    operationDate: String;
    constructor(){
        this.productCode="w";
        this.productName="abc"
        this.ths="50TH/s";
        this.productType="ty";
        this.productStatus="st";
        this.purchaseDate="2020-12-07";
        this.approvalDate ="2020-12-07";
        this.operationDate = "2020-12-07";
    }

}
