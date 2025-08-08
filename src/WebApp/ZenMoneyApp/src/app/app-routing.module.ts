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

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'ZenMoney | Dashboard'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'ZenMoney | Login'
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
