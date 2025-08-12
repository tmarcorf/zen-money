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

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  totalItems = 0; // Para o paginator

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly dialog = inject(MatDialog);

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Eventos do paginator e sort
    this.paginator.page.subscribe(() => this.loadData());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0; // Reseta para página 1 quando muda a ordem
      this.loadData();
    });

    // Carrega os dados iniciais
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

  onRowClicked(row: CategoryModel) {
    
  }

  applyFilter(): void {
    this.paginator.pageIndex = 0; // Reseta para página 1
    this.loadData();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateUpdateCategoryComponent, {
      width: '400px',
      height: '215px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
}
