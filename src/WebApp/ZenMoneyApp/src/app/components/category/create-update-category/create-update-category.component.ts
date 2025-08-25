import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryModel } from '../../../responses/category/category-model';
import { CreateCategoryRequest } from '../../../requests/category/create-category.request';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { UpdateCategoryRequest } from '../../../requests/category/update-category.request';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

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
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateUpdateCategoryComponent>,
    private confirmDialog: MatDialog,
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
    if (this.isNewCategory) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    var request: CreateCategoryRequest = {
        name: this.form.get('name')?.value
      };

      this.categoryService.create(request).subscribe({
        next: (response) => {
          this.notificationService.success(`Categoria ${response.data.name} criada com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  update() {
    var request: UpdateCategoryRequest = {
        id: this.data.row.id,
        name: this.form.get('name')?.value
      };

      this.categoryService.update(request).subscribe({
        next: (response) => {
          this.notificationService.success(`Categoria ${response.data.name} atualizada com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  delete() {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '410px',
      height: '200px',
      data: {
        title: 'Remover Categoria',
        description: 'Deseja remover esta categoria ?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var id = this.data.row.id;

        this.categoryService.delete(id).subscribe({
          next: (response) => {
            this.notificationService.success(`Categoria ${response.data.name} removida com sucesso`);
            this.dialogRef.close();
          },
          error: (response) => {
            this.notificationService.errors(response.error.errors);
          }
        })
      }
    });
  }
}
