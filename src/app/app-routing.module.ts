import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../app/component/home/home.component';
import { TableComponent } from '../app/component/table/table.component';
import { DashboardComponent } from '../app/component/dashboard/dashboard.component';
import { MiningStatusComponent } from '../app/component/mining-status/mining-status.component';
import { TransactionListComponent } from '../app/component/transaction-list/transaction-list.component'
import { UserListComponent } from '../app/component/user-list/user-list.component';
import { BtcPriceComponent } from '../app/component/btc-price/btc-price.component'
import { TableExComponent } from '../app/component/table-ex/table-ex.component';
import { BtcWalletComponent } from './component/btc-wallet/btc-wallet.component';
import { BtcWithdrawComponent } from './component/btc-withdraw/btc-withdraw.component';
import { UsdWithdrawComponent } from './component/usd-withdraw/usd-withdraw.component';
import { MarcketingDashComponent } from './component/marcketing-dash/marcketing-dash.component';
import { ExchangeChartComponent } from './component/exchange-chart/exchange-chart.component';
import { WithdrawEditComponent } from '../app/component/withdraw-edit/withdraw-edit.component';
import { BinaryTreeComponent } from 'src/app/component/tree/binary-tree/binary-tree.component';
import { AddMemberComponent } from './component/add-member/add-member.component';
import { UserRewardComponent } from './component/user-reward/user-reward.component';
import { UserModeRewardComponent } from './component/usermode-reward/usermode-reward.component' 
import { AllRewardComponent } from './component/all-reward/all-reward.component'
import { AllSalesComponent } from './component/all-sales/all-sales.component'
import { RecentTransactionComponent } from './component/recent-transaction/recent-transaction.component'

const routes: Routes = [
  { path: 'com/base/getPageUrl.do', component: HomeComponent },
  { path: '', redirectTo: 'com/dashboard', pathMatch: 'full' },
  { path: 'com/mining/status', component: MiningStatusComponent },
  { path: 'com/table', component: TableComponent },
  { path: 'com/dashboard', component: DashboardComponent },
  { path: 'admin/transaction-list', component: TransactionListComponent },
  { path: 'admin/user-list', component: UserListComponent },
  { path: 'all/coin-price', component: BtcPriceComponent },
  { path: 'com/ex', component: TableExComponent },
  { path: 'com/btc-dashboard', component: BtcWalletComponent },
  { path: 'com/getWithdraw', component: BtcWithdrawComponent },

  { path: 'com/usd-withdraw', component: UsdWithdrawComponent },
  { path: 'com/marketing-dash', component: MarcketingDashComponent },
  { path: 'com/exchange-chart', component: ExchangeChartComponent },
  { path: 'com/check-exchange', component: WithdrawEditComponent },

  { path: 'com/marketing/binaryTree', component: BinaryTreeComponent },
  { path: 'com/marketing/addMember', component: AddMemberComponent },
  { path: 'admin/reward', component: UserRewardComponent},
  { path: 'user/reward', component: UserModeRewardComponent},
  { path: 'admin/allreward', component: AllRewardComponent},
  { path: 'admin/allsales', component: AllSalesComponent},
  { path: 'all/recent-transaction', component: RecentTransactionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],

  exports: [RouterModule]
})
export class AppRoutingModule { }

