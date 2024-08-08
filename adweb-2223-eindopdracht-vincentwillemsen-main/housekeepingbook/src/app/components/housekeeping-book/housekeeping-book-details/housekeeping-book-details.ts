import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TransactionModel} from "../../../models/transaction.model";
import {TransactionService} from "../../../services/transaction.service";
import {CategoryModel} from "../../../models/category.model";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-housekeeping-book',
  templateUrl: './housekeeping-book-details.html',
  styleUrls: ['./housekeeping-book-details.css']
})

export class HousekeepingBookDetails {
  public id: string
  public transactions: TransactionModel[] = [];
  private categories: CategoryModel[] = [];
  private service: TransactionService;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public categoryService: CategoryService,
    service: TransactionService
  ) {
    this.service = service;
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
    service.getTransactionList(this.id, activatedRoute).subscribe(transactions => this.transactions = transactions)
    categoryService.getCategories(activatedRoute).subscribe(categories => this.categories = categories)
  }

  deleteTransaction(transaction: TransactionModel) {
    if (confirm("Remove " + transaction.name)) {
      this.service.deleteTransaction(transaction.id, this.id);
    }
  }

  getCategoryName(id: string) {
    let categoryName = "Unassigned";
    this.categories.forEach( (category) => {
      if (category.id == id) {
        categoryName = category.name;
      }
    })
    return categoryName;
  }
}
