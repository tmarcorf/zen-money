import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { CategoryComponent } from './components/category/category.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { ReportComponent } from './components/report/report.component';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { HomeComponent } from './components/home/home.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CreateUpdateCategoryComponent } from './components/category/create-update-category/create-update-category.component';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        LayoutComponent,
        DashboardComponent,
        IncomeComponent,
        ExpenseComponent,
        CategoryComponent,
        PaymentMethodComponent,
        ReportComponent,
        HomeComponent,
        LoadingComponent,
        CreateAccountComponent,
        CreateUpdateCategoryComponent,
    ],
    bootstrap: [AppComponent], 
    imports: [
      BrowserModule,
        AppRoutingModule,
        MatSlideToggleModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatButton,
        MatSidenavModule,
        MatCardModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginator,
        MatPaginatorModule,
        MatSortModule,
        NgxMaskDirective,
      ], 
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        provideAnimationsAsync(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideNgxMask()
    ] })
export class AppModule { }
