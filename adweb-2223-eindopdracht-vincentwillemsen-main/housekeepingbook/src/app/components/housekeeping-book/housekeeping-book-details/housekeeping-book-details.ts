import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionModel } from "../../../models/transaction.model";
import { TransactionService } from "../../../services/transaction.service";
import { CategoryModel } from "../../../models/category.model";
import { CategoryService } from "../../../services/category.service";
import { Chart, registerables } from 'chart.js';
import {catchError, combineLatest, forkJoin, mergeMap} from "rxjs";

Chart.register(...registerables);

@Component({
  selector: 'app-housekeeping-book',
  templateUrl: './housekeeping-book-details.html',
  styleUrls: ['./housekeeping-book-details.css']
})
export class HousekeepingBookDetails implements OnInit {
  public id: string;
  public transactions: TransactionModel[] = [];
  categories: { name: string; id: string }[] = [];
  public lineChart: any;
  public barChart: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public categoryService: CategoryService,
    private transactionService: TransactionService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.transactionService.getTransactionList(this.id, this.activatedRoute).pipe(
      mergeMap(transactions => {
        this.transactions = transactions;
        return this.categoryService.getCategories(this.activatedRoute);
      })
    ).subscribe(categories => {
      this.categories = categories;
      console.log('Transactions:', this.transactions);
      console.log('Categories:', this.categories);
      this.createCharts();
    });
  }

  deleteTransaction(transaction: TransactionModel): void {
    if (confirm("Remove " + transaction.name)) {
      this.transactionService.deleteTransaction(transaction.id, this.id);
    }
  }

  getCategoryName(id: string): string {
    let categoryName = "Unassigned";
    this.categories.forEach(category => {
      if (category.id === id) {
        categoryName = category.name;
      }
    });
    return categoryName;
  }

  createCharts(): void {
    this.createLineChart();
    this.createBarChart();
  }

  private createLineChart(): void {
    let dataValues: number[] = [];
    let dataDates: string[] = [];
    let saldo = 0;

    let tempTransactions = this.transactions.sort(function(a: TransactionModel, b: TransactionModel){
              return b.issuedAt.localeCompare(a.issuedAt.toString())});
    tempTransactions.forEach(transaction => {
      saldo = saldo + transaction.amount;
      const date = new Date(transaction.issuedAt).toISOString().split('T')[0];
      dataValues.push(saldo);
      dataDates.push(date);
    });

    this.lineChart = new Chart("LineChart", {
      type: 'line',
      data: {
        labels: dataDates,
        datasets: [
          {
            label: "Saldo",
            data: dataValues,
            borderColor: 'orange',
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            min: -200,
            max: 1000,
            ticks: {
              stepSize: 100
            }
          }
        }
      }
    });
  }

  private createBarChart(): void {
    let labels: string[] = [];
    let data: number[] = [];

    this.categories.forEach( cat => {
      let totalSpent: number = 0;

      this.transactions.forEach(trans => {
        if (trans.categoryId == cat.id && trans.amount < 0) {
          totalSpent = trans.amount + totalSpent;
        }
      })

      labels.push(cat.name);
      data.push(totalSpent);
      console.log(cat.name);
      console.log(totalSpent);
    });

    console.log(labels);
    console.log(data);

     this.barChart = new Chart("BarChart", {
       type: 'bar',
       data: {
         labels: labels,
         datasets: [
           {
             label: 'Expenses by Category',
             data: data,
             borderColor: 'orange',
             backgroundColor: 'rgba(128, 0, 0, 0.2)'
           }
         ]
       },
       options: {
         aspectRatio: 2.5,
         scales: {
           y: {
             max: 0,
             min: -1000,
             ticks: {
               stepSize: 100
             }
           }
         }
       }
     });
   }
}
