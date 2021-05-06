import { Component, OnInit } from '@angular/core';
import { faCoins} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-btc-withdraw',
  templateUrl: './btc-withdraw.component.html',
  styleUrls: ['./btc-withdraw.component.css']
})
export class BtcWithdrawComponent implements OnInit {

  faCoins = faCoins;

  constructor() { }

  ngOnInit(): void {
  }

}
