/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { HousekeepingBookDetails } from './housekeeping-book-details';
import { TransactionService } from '../../../services/transaction.service';
import { CategoryService } from '../../../services/category.service';
import { TransactionModel } from '../../../models/transaction.model';
import { CategoryModel } from '../../../models/category.model';
import { Chart } from 'chart.js';

describe('HousekeepingBookDetails', () => {
  let component: HousekeepingBookDetails;
  let fixture: ComponentFixture<HousekeepingBookDetails>;
  let mockTransactionService;
  let mockCategoryService;
  let mockRouter;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj(['getTransactionList', 'deleteTransaction']);
    mockCategoryService = jasmine.createSpyObj(['getCategories']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }
    };

    await TestBed.configureTestingModule({
      declarations: [HousekeepingBookDetails],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HousekeepingBookDetails);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions and categories on init and create charts', () => {
    const transactionsMockData: TransactionModel[] = [
      { id: '1', name: 'Test Transaction', amount: 100, categoryId: '1', issuedAt: '2024-01-01T00:00:00Z' }
    ];
    const categoriesMockData: CategoryModel[] = [
      { id: '1', name: 'Test Category' }
    ];

    mockTransactionService.getTransactionList.and.returnValue(of(transactionsMockData));
    mockCategoryService.getCategories.and.returnValue(of(categoriesMockData));

    spyOn(component, 'createCharts');

    fixture.detectChanges(); // triggers ngOnInit

    expect(mockTransactionService.getTransactionList).toHaveBeenCalledWith('1', mockActivatedRoute);
    expect(mockCategoryService.getCategories).toHaveBeenCalledWith(mockActivatedRoute);
    expect(component.transactions).toEqual(transactionsMockData);
    expect(component.categories).toEqual(categoriesMockData);
    expect(component.createCharts).toHaveBeenCalled();
  });

  it('should delete a transaction and confirm deletion', () => {
    const transaction: { amount: number; name: string; id: string; issuedAt: string; categoryId: string } = { id: '1', name: 'Test Transaction', amount: 100, categoryId: '1', issuedAt: '2024-01-01T00:00:00Z' };
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteTransaction(transaction);

    expect(window.confirm).toHaveBeenCalledWith('Remove Test Transaction');
    expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith('1', '1');
  });

  it('should return the correct category name based on the category ID', () => {
    component.categories = [{ id: '1', name: 'Test Category' }];
    const categoryName = component.getCategoryName('1');
    expect(categoryName).toEqual('Test Category');

    const unassignedCategoryName = component.getCategoryName('2');
    expect(unassignedCategoryName).toEqual('Unassigned');
  });

  it('should create line chart with sorted transactions', () => {
    component.transactions = [
      { id: '1', name: 'Transaction 1', amount: 100, categoryId: '1', issuedAt: '2024-01-01T00:00:00Z' },
      { id: '2', name: 'Transaction 2', amount: -50, categoryId: '1', issuedAt: '2024-01-02T00:00:00Z' }
    ];

    spyOn(Chart.prototype, 'constructor').and.callThrough();

    component.createLineChart();

    expect(component.lineChart).toBeDefined();
    expect(component.lineChart.data.labels).toEqual(['2024-01-02', '2024-01-01']);
    expect(component.lineChart.data.datasets[0].data).toEqual([50, 100]);
  });

  it('should create bar chart with expenses by category', () => {
    component.transactions = [
      { id: '1', name: 'Transaction 1', amount: -100, categoryId: '1', issuedAt: '2024-01-01T00:00:00Z' },
      { id: '2', name: 'Transaction 2', amount: -50, categoryId: '2', issuedAt: '2024-01-02T00:00:00Z' }
    ];
    component.categories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' }
    ];

    spyOn(Chart.prototype, 'constructor').and.callThrough();

    component.createBarChart();

    expect(component.barChart).toBeDefined();
    expect(component.barChart.data.labels).toEqual(['Category 1', 'Category 2']);
    expect(component.barChart.data.datasets[0].data).toEqual([-100, -50]);
  });
});
*/
