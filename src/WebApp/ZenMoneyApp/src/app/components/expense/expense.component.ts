import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseModel } from '../../responses/expense/expense-model';
import { ExpenseTypeEnum } from '../../enums/expense-type.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { ExpenseService } from '../../services/expense.service';
import { SortField } from '../../enums/sort-field.enum';
import { SortDirection } from '../../enums/sort-direction.enum';
import { SearchExpenseRequest } from '../../requests/expense/search-expense.request';
import { CreateUpdateExpenseComponent } from './create-update-expense/create-update-expense.component';

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styleUrl: './expense.component.scss',
    standalone: false
})
export class ExpenseComponent {
    displayedColumns: string[] = ['type', 'category', 'description', 'date',  'paymentMethod', 'amount', 'isPaid'];
    dataSource = new MatTableDataSource<ExpenseModel>();
    isNewExpenseDialog: boolean = false;
    incomeTypes = Object.values(ExpenseTypeEnum);
    dialogWidth = '400px';
    dialogHeight = '673px';
    
    totalItems = 0;

    form: FormGroup = new FormGroup({
        type: new FormControl(''),
        startDate: new FormControl(''),
        endDate: new FormControl(''),
        description: new FormControl(''),
        amount: new FormControl('')
    });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly dialog = inject(MatDialog);

  constructor(
    private expenseService: ExpenseService,
    private notificationService: NotificationService
  ) {}

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.updateDataSource());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.updateDataSource();
    });

    this.sort.active = 'date';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit({ active: this.sort.active, direction: this.sort.direction });

    this.updateDataSource();
  }

  updateDataSource(): void {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;
    let sortField: SortField | null = null;
    let sortDirection: SortDirection | null = null;

    if (this.sort) {
      if (this.sort?.active == 'type') {
        sortField = SortField.Type;
      } else if(this.sort?.active == 'category') {
        sortField = SortField.Category;
      } else if(this.sort?.active == 'description') {
        sortField = SortField.Description;
      } else if(this.sort?.active == 'date') {
        sortField = SortField.Date;
      } else if(this.sort?.active == 'paymentMethod') {
        sortField = SortField.PaymentMethod;
      } else if(this.sort?.active == 'amount') {
        sortField = SortField.Amount;
      } else if(this.sort?.active == 'isPaid') {
        sortField = SortField.IsPaid;
      }

      if (this.sort?.direction == 'asc') {
        sortDirection = SortDirection.Asc;
      } else if(this.sort?.direction == 'desc') {
        sortDirection = SortDirection.Desc;
      }
    }

    const request: SearchExpenseRequest = {
        type: this.form.get('type')?.value ?? '',
        startDate: this.getDateToSearch(this.form.get('startDate')?.value),
        endDate: this.getDateToSearch(this.form.get('endDate')?.value),
        description: this.form.get('description')?.value ?? '',
        offset: pageIndex * pageSize,
        take: pageSize,
        sortField: sortField,
        sortDirection: sortDirection
    };

    this.expenseService.listPaginated(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.totalCount ?? 0;
      },
      error: (response) => {
        this.notificationService.errors(response.error.errors);
      }
    });
  }

  applyFilter(): void {
    this.paginator.pageIndex = 0;
    this.updateDataSource();
  }

  create(): void {
    this.isNewExpenseDialog = true

    const dialogRef = this.dialog.open(CreateUpdateExpenseComponent, {
      width: this.dialogWidth,
      height: this.dialogHeight,
      autoFocus: false,
      data: {
        row: null, 
        isNewExpenseDialog: this.isNewExpenseDialog
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateDataSource();
    });
  }

  update(row: ExpenseModel) {
    this.isNewExpenseDialog = false;

    const dialogRef = this.dialog.open(CreateUpdateExpenseComponent, {
      width: this.dialogWidth,
      height: this.dialogHeight,
      autoFocus: false,
      data: {
        row: row, 
        isNewExpenseDialog: this.isNewExpenseDialog
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateDataSource();
    });
  }

  formatDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    event.target.value = value;
  }

  getDateToSearch(date: any): string {
    return date != '' && date != null 
      ? new Date(date as Date).toISOString().split('T')[0] 
      : '';
  }
}
