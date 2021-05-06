import { Component, OnInit } from '@angular/core';
import { faCoins, faLink} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-btc-wallet',
  templateUrl: './btc-wallet.component.html',
  styleUrls: ['./btc-wallet.component.css']
})
export class BtcWalletComponent implements OnInit {

  faCoins = faCoins;
  faLink = faLink;


  constructor() { }

  ngOnInit(): void {
  }

}
