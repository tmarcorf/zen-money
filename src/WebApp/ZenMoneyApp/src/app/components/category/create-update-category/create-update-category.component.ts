import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-update-category',
  standalone: false,
  templateUrl: './create-update-category.component.html',
  styleUrl: './create-update-category.component.scss'
})
export class CreateUpdateCategoryComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  submit() {

  }
}
