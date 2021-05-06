export class RecentTransactionVO {
    usdPrice: number;
    gubun: string;
    amount: number;
    regDate: Date;

    constructor(usdPrice: number, gubun:string, amount: number, regDate: Date) {
        this.usdPrice = usdPrice;
        this.gubun = gubun;
        this.amount = amount;
        this.regDate = regDate;
    }
}