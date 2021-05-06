import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from './modules/material/material.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartsModule } from 'ng2-charts';
import {MatTabsModule} from '@angular/material/tabs';


import { TableComponent } from 'src/app/component/table/table.component';
import { DashboardComponent } from 'src/app/component/dashboard/dashboard.component';

import { MiningStatusComponent } from 'src/app/component/mining-status/mining-status.component';
import { TransactionListComponent } from 'src/app/component/transaction-list/transaction-list.component'
import { UserListComponent } from 'src/app/component/user-list/user-list.component';
import { BtcPriceComponent } from 'src/app/component/btc-price/btc-price.component';
import { TableExComponent } from 'src/app/component/table-ex/table-ex.component';

import { BtcWalletComponent } from 'src/app/component/btc-wallet/btc-wallet.component';
import { BtcWithdrawComponent } from 'src/app/component/btc-withdraw/btc-withdraw.component';
import { UsdWithdrawComponent } from 'src/app/component/usd-withdraw/usd-withdraw.component';
import { MarcketingDashComponent } from 'src/app/component/marcketing-dash/marcketing-dash.component';
import { ExchangeChartComponent } from 'src/app/component/exchange-chart/exchange-chart.component';

import { CovidService } from 'src/app/component/marcketing-dash/covid.service';
import { FileSaverModule } from 'ngx-filesaver';
import { WithdrawEditComponent } from 'src/app/component/withdraw-edit/withdraw-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { BinaryTreeComponent } from 'src/app/component/tree/binary-tree/binary-tree.component';

import { GoogleChartsModule } from 'angular-google-charts';
import { AddMemberComponent } from './component/add-member/add-member.component';
import { TreeDetailComponent } from './component/tree/tree-detail/tree-detail.component';
import { UserInfoService } from './service/user-info.service';
import { TempUserInfoStorageService } from './service/temp-user-info-storage.service';
import { TreeTableComponent } from './component/tree/tree-table/tree-table.component';
import { UserRewardComponent } from './component/user-reward/user-reward.component';
import { UserModeRewardComponent } from './component/usermode-reward/usermode-reward.component';
import { AllRewardComponent } from './component/all-reward/all-reward.component' ;
import { AllSalesComponent } from './component/all-sales/all-sales.component';
import { RecentTransactionComponent } from './component/recent-transaction/recent-transaction.component'


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    DashboardComponent,
    MiningStatusComponent,
    TransactionListComponent,
    UserListComponent,
    BtcPriceComponent,
    TableExComponent,
    BtcWalletComponent,
    BtcWithdrawComponent,
    UsdWithdrawComponent,
    MarcketingDashComponent,
    ExchangeChartComponent,
    WithdrawEditComponent,
    PageNotFoundComponent,
    BinaryTreeComponent,
    AddMemberComponent,
    TreeDetailComponent,
    TreeTableComponent,
    UserRewardComponent,
    UserModeRewardComponent,
    AllRewardComponent,
    AllSalesComponent,
    RecentTransactionComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    MatInputModule,
    MatSliderModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatTableModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    ChartsModule,
    FileSaverModule,
    GoogleChartsModule,
    MatTabsModule
  ],
  providers: [
    MatDatepickerModule,
    DatePipe,
    CovidService,
    UserInfoService, TempUserInfoStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
