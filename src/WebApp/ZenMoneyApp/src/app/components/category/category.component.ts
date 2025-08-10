import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CategoryModel } from '../../responses/category/category-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

const CATEGORY_DATA: CategoryModel[] = [
  { name: 'Electronics', createdAt: '2025-01-15', updatedAt: '2025-02-10' },
  { name: 'Books', createdAt: '2025-02-05', updatedAt: '2025-02-15' },
  { name: 'Clothing', createdAt: '2025-03-01', updatedAt: '2025-03-12' },
  { name: 'Home & Kitchen', createdAt: '2025-01-20', updatedAt: '2025-02-08' },
  { name: 'Sports', createdAt: '2025-02-18', updatedAt: '2025-03-05' },
  { name: 'Toys', createdAt: '2025-03-10', updatedAt: '2025-03-25' },
  { name: 'Beauty', createdAt: '2025-01-25', updatedAt: '2025-02-20' },
  { name: 'Garden', createdAt: '2025-02-12', updatedAt: '2025-03-02' },
  { name: 'Automotive', createdAt: '2025-01-30', updatedAt: '2025-02-25' },
  { name: 'Health', createdAt: '2025-03-04', updatedAt: '2025-03-18' },
  { name: 'Jewelry', createdAt: '2025-02-01', updatedAt: '2025-02-14' },
  { name: 'Pet Supplies', createdAt: '2025-03-06', updatedAt: '2025-03-22' },
  { name: 'Music', createdAt: '2025-01-18', updatedAt: '2025-02-05' },
  { name: 'Movies', createdAt: '2025-02-08', updatedAt: '2025-02-19' },
  { name: 'Games', createdAt: '2025-03-01', updatedAt: '2025-03-15' },
  { name: 'Office Supplies', createdAt: '2025-01-22', updatedAt: '2025-02-11' },
  { name: 'Shoes', createdAt: '2025-02-14', updatedAt: '2025-03-01' },
  { name: 'Furniture', createdAt: '2025-01-27', updatedAt: '2025-02-17' },
  { name: 'Crafts', createdAt: '2025-03-09', updatedAt: '2025-03-24' },
  { name: 'Bags', createdAt: '2025-02-03', updatedAt: '2025-02-21' }
];

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
    standalone: false
})
export class CategoryComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  displayedColumns: string[] = ['name', 'createdAt', 'updatedAt'];
  dataSource = new MatTableDataSource<CategoryModel>(CATEGORY_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
