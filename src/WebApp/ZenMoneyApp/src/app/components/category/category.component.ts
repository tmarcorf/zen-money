import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateCategoryComponent } from './create-update-category/create-update-category.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchCategoryRequest } from '../../requests/category/search-category.request';
import { CategoryModel } from '../../responses/category/category-model';
import { SortField } from '../../enums/sort-field.enum';
import { SortDirection } from '../../enums/sort-direction.enum';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  standalone: false
})
export class CategoryComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'createdAt', 'updatedAt'];
  dataSource = new MatTableDataSource<CategoryModel>();
  isNewCategoryDialog: boolean = false;

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly dialog = inject(MatDialog);

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.updateDataSource());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.updateDataSource();
    });

    this.updateDataSource();
  }

  updateDataSource(): void {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;
    let sortField: SortField | null = null;
    let sortDirection: SortDirection | null = null;

    if (this.sort) {
      if (this.sort?.active == 'name') {
        sortField = SortField.Name;
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

    const request: SearchCategoryRequest = {
      name: this.form.get('name')?.value ?? '',
      offset: pageIndex * pageSize,
      take: pageSize,
      sortField: sortField,
      sortDirection: sortDirection
    };

    this.categoryService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.totalCount ?? 0;
      },
      error: (response) => {
        this.notificationService.errors(response.error.errors);
      }
    });
  }

  update(row: CategoryModel) {
    this.isNewCategoryDialog = false;

    const dialogRef = this.dialog.open(CreateUpdateCategoryComponent, {
      width: '400px',
      height: '215px',
      autoFocus: false,
      data: {
        row: row, 
        isNewCategoryDialog: this.isNewCategoryDialog
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateDataSource();
    });
  }

  applyFilter(): void {
    this.paginator.pageIndex = 0;
    this.updateDataSource();
  }

  create(): void {
    this.isNewCategoryDialog = true

    const dialogRef = this.dialog.open(CreateUpdateCategoryComponent, {
      width: '400px',
      height: '215px',
      autoFocus: false,
      data: {
        row: null, 
        isNewCategoryDialog: this.isNewCategoryDialog
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateDataSource();
    });
  }
}
