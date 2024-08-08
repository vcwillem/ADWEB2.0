import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TransactionService} from "../../../services/transaction.service";
import {CategoryService} from "../../../services/category.service";
import {CategoryModel} from "../../../models/category.model";

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.component.html',
  styleUrls: ['./transaction-create.component.css']
})
export class TransactionCreateComponent {
  private routeSubscription: Subscription;
  private housekeepingBookId: string;
  public transactionForm: FormGroup;
  public categories: CategoryModel[];

  constructor(
    public service: TransactionService,
    public categoryService: CategoryService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.transactionForm = this.formBuilder.group({
      name: [''],
      description: [''],
      amount: [''],
      categoryId: ['']
    })

    this.routeSubscription = this.route.params.subscribe(params => {
      this.housekeepingBookId = params['id']
    });

    categoryService.getCategories(route).subscribe(categories => this.categories = categories)
  }

  onSubmit(){
    this.service.createTransaction(this.transactionForm.value, this.housekeepingBookId);
    this.router.navigate(['/housekeeping-book/details/' + this.housekeepingBookId ], { queryParams: {orderIssuedAt: 'up'} });
  }
}
