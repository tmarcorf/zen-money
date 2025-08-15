import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IncomeModel } from '../../responses/income/income.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { IncomeService } from '../../services/income.service';
import { NotificationService } from '../../services/notification.service';
import { SortField } from '../../enums/sort-field.enum';
import { SortDirection } from '../../enums/sort-direction.enum';
import { SearchIncomeRequest } from '../../requests/income/search-income.request';
import { IncomeTypeEnum } from '../../enums/income-type.enum';
import { CreateUpdateIncomeComponent } from './create-update-income/create-update-income.component';
import moment from 'moment';

@Component({
    selector: 'app-income',
    templateUrl: './income.component.html',
    styleUrl: './income.component.scss',
    standalone: false
})
export class IncomeComponent {
    displayedColumns: string[] = ['type', 'description', 'date', 'amount'];
    dataSource = new MatTableDataSource<IncomeModel>();
    isNewIncomeDialog: boolean = false;
    incomeTypes = Object.values(IncomeTypeEnum);
    
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
    private incomeService: IncomeService,
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
      } else if(this.sort?.active == 'date') {
        sortField = SortField.Date;
      } else if(this.sort?.active == 'description') {
        sortField = SortField.Description;
      } else if(this.sort?.active == 'amount') {
        sortField = SortField.Amount;
      }

      if (this.sort?.direction == 'asc') {
        sortDirection = SortDirection.Asc;
      } else if(this.sort?.direction == 'desc') {
        sortDirection = SortDirection.Desc;
      }
    }
    
    const request: SearchIncomeRequest = {
        type: this.form.get('type')?.value ?? '',
        startDate: this.getDateToSearch(this.form.get('startDate')?.value),
        endDate: this.getDateToSearch(this.form.get('endDate')?.value),
        description: this.form.get('description')?.value ?? '',
        offset: pageIndex * pageSize,
        take: pageSize,
        sortField: sortField,
        sortDirection: sortDirection
    };

    this.incomeService.listPaginated(request).subscribe({
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
    this.isNewIncomeDialog = true

    const dialogRef = this.dialog.open(CreateUpdateIncomeComponent, {
      width: '400px',
      height: '460px',
      autoFocus: false,
      data: {
        row: null, 
        isNewIncomeDialog: this.isNewIncomeDialog
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateDataSource();
    });
  }

  update(row: IncomeModel) {
    this.isNewIncomeDialog = false;

    const dialogRef = this.dialog.open(CreateUpdateIncomeComponent, {
      width: '400px',
      height: '460px',
      autoFocus: false,
      data: {
        row: row, 
        isNewIncomeDialog: this.isNewIncomeDialog
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
