import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})

export class CategoryCreateComponent {
  public categoryForm: FormGroup;

  constructor(
    public service: CategoryService,
    public formBuilder: FormBuilder,
    public router: Router
  ) {
    this.categoryForm = this.formBuilder.group({
      name: [''],
      budget: [''],
      dueDate: ['']
    })
  }

  onSubmit(){
    this.service.createCategory(this.categoryForm.value);
    this.router.navigate(['/category/list' ]);
  }
}
