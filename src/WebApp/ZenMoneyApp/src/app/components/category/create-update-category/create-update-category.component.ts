import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryModel } from '../../../responses/category/category-model';

@Component({
  selector: 'app-create-update-category',
  standalone: false,
  templateUrl: './create-update-category.component.html',
  styleUrl: './create-update-category.component.scss'
})
export class CreateUpdateCategoryComponent implements AfterViewInit {
  isNewCategory: boolean = false;
  selectedCategory?: CategoryModel;

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {row: CategoryModel, isNewCategoryDialog: boolean}){
      this.selectedCategory = data.row;
      this.isNewCategory = data.isNewCategoryDialog;
    }

  ngAfterViewInit(): void {
    if(this.selectedCategory) {
      this.form.get('name')?.setValue(this.selectedCategory.name);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {

  }
}
