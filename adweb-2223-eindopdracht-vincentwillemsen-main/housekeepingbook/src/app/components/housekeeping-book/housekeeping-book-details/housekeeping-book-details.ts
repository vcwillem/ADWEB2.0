import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionModel } from "../../../models/transaction.model";
import { TransactionService } from "../../../services/transaction.service";
import { CategoryModel } from "../../../models/category.model";
import { CategoryService } from "../../../services/category.service";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-housekeeping-book',
  templateUrl: './housekeeping-book-details.html',
  styleUrls: ['./housekeeping-book-details.css']
})
export class HousekeepingBookDetails implements OnInit {
  public id: string;
  public transactions: TransactionModel[] = [];
  private categories: CategoryModel[] = [];
  public lineChart: any;

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
    this.transactionService.getTransactionList(this.id, this.activatedRoute)
      .subscribe(transactions => {
        this.transactions = transactions;
        this.createCharts();
      });

    this.categoryService.getCategories(this.activatedRoute)
      .subscribe(categories => this.categories = categories);
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

  private createCharts(): void {
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

    this.createLineChart(dataValues, dataDates);
  }

  private createLineChart(dataValues: number[], dataDates: string[]): void {
    this.lineChart = new Chart("LineChart", {
      type: 'line',
      data: {
        labels: dataDates,
        datasets: [
          {
            label: "Saldo",
            data: dataValues,
            borderColor: 'orange',
            backgroundColor: 'rgba(0, 128, 0, 0.2)'
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
}
