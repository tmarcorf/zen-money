import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../services/notification.service';
import { PaymentMethodService } from '../../services/payment-method.service';
import { PaymentMethodModel } from '../../responses/payment-method/payment-method.model';
import { SortField } from '../../enums/sort-field.enum';
import { SortDirection } from '../../enums/sort-direction.enum';
import { SearchPaymentMethodRequest } from '../../requests/payment-method/search-payment-method.request';

@Component({
    selector: 'app-payment-method',
    templateUrl: './payment-method.component.html',
    styleUrl: './payment-method.component.scss',
    standalone: false
})
export class PaymentMethodComponent {
    displayedColumns: string[] = ['description', 'createdAt', 'updatedAt'];
    dataSource = new MatTableDataSource<PaymentMethodModel>();
    isNewCategoryDialog: boolean = false;

    form: FormGroup = new FormGroup({
        description: new FormControl(''),
    });

    totalItems = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    readonly dialog = inject(MatDialog);

    constructor(
        private paymentMethodService: PaymentMethodService,
        private notificationService: NotificationService
    ) {}

    ngAfterViewInit(): void {
        this.paginator.page.subscribe(() => this.updateDataSource());
        this.sort.sortChange.subscribe(() => {
          this.paginator.pageIndex = 0;
          this.updateDataSource();
        });
    
        this.sort.active = 'createdAt';
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
          if (this.sort?.active == 'description') {
            sortField = SortField.Description;
          } else if(this.sort?.active == 'createdAt') {
            sortField = SortField.CreatedAt;
          } else if(this.sort?.active == 'updatedAt') {
            sortField = SortField.UpdatedAt;
          }
    
          if (this.sort?.direction == 'asc') {
            sortDirection = SortDirection.Asc;
          } else if(this.sort?.direction == 'desc') {
            sortDirection = SortDirection.Desc;
          }
        }
    
        const request: SearchPaymentMethodRequest = {
          description: this.form.get('description')?.value ?? '',
          offset: pageIndex * pageSize,
          take: pageSize,
          sortField: sortField,
          sortDirection: sortDirection
        };
    
        this.paymentMethodService.listPaginated(request).subscribe({
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

    update(row: PaymentMethodModel) {
        // this.isNewCategoryDialog = false;
    
        // const dialogRef = this.dialog.open(CreateUpdateCategoryComponent, {
        //   width: '400px',
        //   height: '215px',
        //   autoFocus: false,
        //   data: {
        //     row: row, 
        //     isNewCategoryDialog: this.isNewCategoryDialog
        //   }
        // });
    
        // dialogRef.afterClosed().subscribe(() => {
        //   this.updateDataSource();
        // });
      }
    
    
    
    create(): void {
        // this.isNewCategoryDialog = true
    
        // const dialogRef = this.dialog.open(CreateUpdateCategoryComponent, {
        //   width: '400px',
        //   height: '215px',
        //   autoFocus: false,
        //   data: {
        //     row: null, 
        //     isNewCategoryDialog: this.isNewCategoryDialog
        //   }
        // });
    
        // dialogRef.afterClosed().subscribe(() => {
        //   this.updateDataSource();
        // });
    }
}
