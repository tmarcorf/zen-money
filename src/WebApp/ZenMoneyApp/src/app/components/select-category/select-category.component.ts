import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CategoryModel } from '../../responses/category/category-model';

@Component({
  selector: 'app-select-category',
  standalone: false,
  templateUrl: './select-category.component.html',
  styleUrl: './select-category.component.scss'
})
export class SelectCategoryComponent implements OnInit {
  @Output() selectedCategory = new EventEmitter<CategoryModel | null>();

  categoryFormControl = new FormControl<CategoryModel | null>(null);
  filteredCategories: CategoryModel[] = [];

  constructor(private categoryService: CategoryService,) {}

  ngOnInit(): void {
    this.categoryFormControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const name = typeof value === 'string' ? value : value?.name ?? '';

          if (name == '') {
            this.selectedCategory.emit(null);
          }

          return this.categoryService.listByName(name);
        })
      )
      .subscribe(response => {
        this.filteredCategories = response.data;
    });
  }

  onCategoryClick() {
    if (this.categoryFormControl.value) {
      return;
    }

    this.categoryService.listByName('').subscribe(response => {
      this.filteredCategories = response.data;
    });
  }

  displayCategory(category: CategoryModel | string | null): string {
    return typeof category === 'string'
      ? category
      : category?.name ?? '';
  }

  onCategorySelected(event: any) {
    this.selectedCategory.emit(event.option.value as CategoryModel);
  }
}
