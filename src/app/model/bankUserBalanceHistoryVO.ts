export interface bankUserBalanceHistoryVO {
    WALLET_HISTORY_SEQ:number;
    WALLET_ID:string;
    USER_ID	:string;
    GUBUN:string;
    SORT:number;
    COIN_ID:string;
    AMOUNT:number;
    BALANCE:number;
    REASON:string;
    REASON_DETAIL?:string;	
    REG_DATE:string;	
    REG_USER:string;	
    UP_DATE:string;
    UP_USER:string;
    USE_FLAG:string;

}