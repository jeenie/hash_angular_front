import { Component, OnInit } from '@angular/core';
import { faCoins} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-usd-withdraw',
  templateUrl: './usd-withdraw.component.html',
  styleUrls: ['./usd-withdraw.component.css']
})
export class UsdWithdrawComponent implements OnInit {

  faCoins = faCoins;

  constructor() { }

  ngOnInit(): void {
  }

}
