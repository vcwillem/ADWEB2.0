import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CategoryService} from "../../../services/category.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent {
  public categoryDetails: FormGroup;
  private categoryId: string;
  categoryRef: any;

  constructor(
    public service: CategoryService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.categoryDetails = this.formBuilder.group({
      name: [''],
      budget: [''],
      dueDate: ['']
    })

    this.route.params.subscribe(params => {
      this.categoryId = params['id']
    });

    this.service.getCategoryDoc(this.categoryId).subscribe(ref =>{
      this.categoryRef = ref;
      this.categoryDetails = this.formBuilder.group({
        name:[this.categoryRef.name],
        budget:[this.categoryRef.budget],
        dueDate:[this.categoryRef.dueDate]
      })
    })
  }
}
