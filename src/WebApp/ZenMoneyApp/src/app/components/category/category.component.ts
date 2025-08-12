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
    this.paginator.page.subscribe(() => this.loadData());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.loadData();
    });

    this.loadData();
  }

  loadData(): void {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;

    const request: SearchCategoryRequest = {
      name: this.form.get('name')?.value ?? '',
      offset: pageIndex * pageSize,
      take: pageSize,
      sortField: this.sort?.active ?? '',
      sortDirection: this.sort?.direction ?? ''
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  applyFilter(): void {
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  onAdd(): void {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
}
