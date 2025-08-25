import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CategoryComponent } from './components/category/category.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { ReportComponent } from './components/report/report.component';
import { HomeComponent } from './components/home/home.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InstallmentPurchasesComponent } from './components/installment-purchases/installment-purchases.component';
import { SavingsComponent } from './components/savings/savings.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'ZenMoney | Home'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'ZenMoney | Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'ZenMoney | Login'
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
    title: 'ZenMoney | Criar conta'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'ZenMoney | Dashboard'
  },
  {
    path: 'incomes',
    component: IncomeComponent,
    title: 'ZenMoney | Entradas'
  },
  {
    path: 'expenses',
    component: ExpenseComponent,
    title: 'ZenMoney | Gastos'
  },
  {
    path: 'categories',
    component: CategoryComponent,
    title: 'ZenMoney | Categorias'
  },
  {
    path: 'payment-methods',
    component: PaymentMethodComponent,
    title: 'ZenMoney | Formas de pagamento'
  },
  {
    path: 'reports',
    component: ReportComponent,
    title: 'ZenMoney | Relatórios'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'ZenMoney | Configurações'
  },
  {
    path: 'installment-purchases',
    component: InstallmentPurchasesComponent,
    title: 'ZenMoney | Compras Parceladas'
  },
  {
    path: 'savings',
    component: SavingsComponent,
    title: 'ZenMoney | Cofrinhos'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
