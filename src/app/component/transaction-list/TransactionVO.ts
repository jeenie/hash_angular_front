import { StringLiteral } from 'typescript';

export class TransactionVO {
    regDate: Date; //거래날짜
    userId:string; // 사용자 아이디
    walletId: String; //지갑 아이디
    gubun: String;
    reason : String;
    reasonDetail: String;
    coinId: String; //코인 아이디
    amount: String;
    balance: String; //잔액

    constructor(regDate: Date, userId: string, walletId: string, gubun: string, reason: string, reasonDetail: string, coinId: string, amount: string, balance: string){
        this.regDate=regDate;
        this.userId=userId;
        this.walletId=walletId;
        this.gubun=gubun;
        this.reason=reason;
        this.reasonDetail=reasonDetail;
        this.coinId=coinId;
        this.amount =amount;
        this.balance =balance;
    }
}
