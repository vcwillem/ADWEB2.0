import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {TransactionService} from "../../../services/transaction.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryModel} from "../../../models/category.model";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.css']
})
export class TransactionEditComponent {
  private housekeepingBookId: string;
  private transactionId: string;
  public categories: CategoryModel[];
  public editForm: FormGroup;
  transactionRef: any;
  public selectedCategory: { name: string; id: string };
  public draggedCategory: CategoryModel;

  constructor(
    public service: TransactionService,
    public categoryService: CategoryService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.editForm = this.formBuilder.group({
      name: [''],
      description: [''],
      amount: [''],
      categoryId: ['']
    })

    this.route.params.subscribe(params => {
      this.housekeepingBookId = params['id']
      this.transactionId = params['transactionid']
    });

    this.service.getTransactionDoc(this.transactionId, this.housekeepingBookId).subscribe(ref => {
      this.transactionRef = ref;
      this.editForm = this.formBuilder.group({
        name: [this.transactionRef.name],
        description: [this.transactionRef.description],
        amount: [this.transactionRef.amount],
        categoryId: [this.transactionRef.categoryId]
      })
    })

    categoryService.getCategories(route).subscribe(categories => this.categories = categories)
  }

  onDragStart(category: any) {
    this.draggedCategory = category;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.selectedCategory = this.draggedCategory;
  }


  onSubmit() {
    this.service.updateTransaction(this.editForm.value, this.transactionId, this.housekeepingBookId, this.selectedCategory.id);
    this.router.navigate(['/housekeeping-book/details/' + this.housekeepingBookId], {queryParams: {orderIssuedAt: 'up'}});
  }
}
