import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CategoryModel } from '../../responses/category/category-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

const CATEGORY_DATA: CategoryModel[] = [
  { name: 'Electronics', createdAt: '15/01/2025', updatedAt: '10/02/2025' },
  { name: 'Books', createdAt: '05/02/2025', updatedAt: '15/02/2025' },
  { name: 'Clothing', createdAt: '01/03/2025', updatedAt: '12/03/2025' },
  { name: 'Home & Kitchen', createdAt: '20/01/2025', updatedAt: '08/02/2025' },
  { name: 'Sports', createdAt: '18/02/2025', updatedAt: '05/03/2025' },
  { name: 'Toys', createdAt: '10/03/2025', updatedAt: '25/03/2025' },
  { name: 'Beauty', createdAt: '25/01/2025', updatedAt: '20/02/2025' },
  { name: 'Garden', createdAt: '12/02/2025', updatedAt: '02/03/2025' },
  { name: 'Automotive', createdAt: '30/01/2025', updatedAt: '25/02/2025' },
  { name: 'Health', createdAt: '04/03/2025', updatedAt: '18/03/2025' },
  { name: 'Jewelry', createdAt: '01/02/2025', updatedAt: '14/02/2025' },
  { name: 'Pet Supplies', createdAt: '06/03/2025', updatedAt: '22/03/2025' },
  { name: 'Music', createdAt: '18/01/2025', updatedAt: '05/02/2025' },
  { name: 'Movies', createdAt: '08/02/2025', updatedAt: '19/02/2025' },
  { name: 'Games', createdAt: '01/03/2025', updatedAt: '15/03/2025' },
  { name: 'Office Supplies', createdAt: '22/01/2025', updatedAt: '11/02/2025' },
  { name: 'Shoes', createdAt: '14/02/2025', updatedAt: '01/03/2025' },
  { name: 'Furniture', createdAt: '27/01/2025', updatedAt: '17/02/2025' },
  { name: 'Crafts', createdAt: '09/03/2025', updatedAt: '24/03/2025' },
  { name: 'Bags', createdAt: '03/02/2025', updatedAt: '21/02/2025' }
];

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
    standalone: false
})
export class CategoryComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'createdAt', 'updatedAt'];
  dataSource = new MatTableDataSource<CategoryModel>(CATEGORY_DATA);

   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onRowClicked(row: CategoryModel) {
    console.log("Linha clicada: ");
    console.log(row);
  }
  
}
