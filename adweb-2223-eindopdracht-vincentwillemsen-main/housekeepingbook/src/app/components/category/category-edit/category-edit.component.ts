import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CategoryService} from "../../../services/category.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent {
  public editForm: FormGroup;
  private categoryId: string;
  categoryRef: any;

  constructor(
    public service: CategoryService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.editForm = this.formBuilder.group({
      name: [''],
      budget: [''],
      dueDate: ['']
    })

    this.route.params.subscribe(params => {
      this.categoryId = params['id']
    });

    this.service.getCategoryDoc(this.categoryId).subscribe(ref => {
      this.categoryRef = ref;
      this.editForm = this.formBuilder.group({
        name: [this.categoryRef.name],
        budget: [this.categoryRef.budget],
        dueDate: [this.categoryRef.dueDate]
      })
    })
  }

  onSubmit() {
    this.service.updateCategory(this.editForm.value, this.categoryId);
    this.router.navigate(['/category/list']);
  }
}
