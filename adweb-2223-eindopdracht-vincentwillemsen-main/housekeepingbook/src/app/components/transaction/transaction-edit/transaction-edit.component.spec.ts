import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {TransactionEditComponent} from './transaction-edit.component';
import {TransactionService} from '../../../services/transaction.service';
import {CategoryService} from '../../../services/category.service';
import {CategoryModel} from '../../../models/category.model';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../../environments/environment';

describe('TransactionEditComponent', () => {
  let component: TransactionEditComponent;
  let fixture: ComponentFixture<TransactionEditComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockCategoryService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockTransactionRef = {
    id: '456',
    name: 'Test Transaction',
    description: 'Description',
    amount: 100,
    categoryId: '12AB',
    issuedAt: new Date().toISOString(),
    housekeepingBookId: '123'
  };

  beforeEach(async () => {
    const mockCategories: CategoryModel[] = [
      {id: '12AB', name: 'Category 1', budget: 500, dueDate: '2024-12-31', userId: '4213'},
      {id: '23CD', name: 'Category 2', budget: 1500, dueDate: '2024-12-31', userId: '1232'}
    ];

    mockCategoryService = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(of(mockCategories))
    };

    mockTransactionService = jasmine.createSpyObj('TransactionService', ['getTransactionDoc', 'updateTransaction']);

    mockActivatedRoute = {
      params: of({id: '123', transactionid: '456'})
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockTransactionService.getTransactionDoc.and.returnValue(of(mockTransactionRef));

    await TestBed.configureTestingModule({
      declarations: [TransactionEditComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      providers: [
        FormBuilder,
        {provide: TransactionService, useValue: mockTransactionService},
        {provide: CategoryService, useValue: mockCategoryService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start the form with transaction information', () => {
    expect(component.editForm.get('name')?.value).toBe('Test Transaction');
    expect(component.editForm.get('description')?.value).toBe('Description');
    expect(component.editForm.get('amount')?.value).toBe(100);
    expect(component.editForm.get('categoryId')?.value).toBe('12AB');
  });

  it('should update and navigate on form submit', () => {
    const mockFormValue = {
      name: 'Updated Transaction',
      description: 'Updated Description',
      amount: 200,
      categoryId: '23CD'
    };

    component.editForm.setValue(mockFormValue);
    component.selectedCategory = {id: '23CD', name: 'Category 1'};

    component.onSubmit();

    expect(mockTransactionService.updateTransaction);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/housekeeping-book/details/123'], {
      queryParams: {orderIssuedAt: 'up'}
    });
  });

  it('should get categories on start', () => {
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Category 1');
    expect(component.categories[1].name).toBe('Category 2');
  });
});
