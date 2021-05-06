export class ChildDetailVO {
    no: number;
    sumStCoin: number;
    sumCrtUsd: number;
    totalCoin: number;
    totalUsd: number;
    childList: [];

    constructor(no: number, sumStCoin: number, sumCrtUsd: number, totalCoin: number, totalUsd: number, childList: []) {
        this.no = no;
        this.sumStCoin = sumStCoin;
        this.sumCrtUsd = sumCrtUsd;
        this.totalCoin = totalCoin;
        this.totalUsd = totalUsd;
        this.childList = childList;
    }
}