import {Component} from '@angular/core';
import {Subscription} from "rxjs";
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

    this.service.getTransactionDoc(this.transactionId, this.housekeepingBookId).subscribe(ref =>{
      this.transactionRef = ref;
      this.editForm = this.formBuilder.group({
        name:[this.transactionRef.name],
        description:[this.transactionRef.description],
        amount:[this.transactionRef.amount],
        categoryId:[this.transactionRef.categoryId]
      })
    })

    categoryService.getCategories(route).subscribe(categories => this.categories = categories)
  }

  onSubmit(){
    this.service.updateTransaction(this.editForm.value, this.transactionId, this.housekeepingBookId);
    this.router.navigate(['/housekeeping-book/details/' + this.housekeepingBookId ], { queryParams: {orderIssuedAt: 'up'} });
  }
}
