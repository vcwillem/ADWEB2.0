import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionCreateComponent } from './transaction-create.component';
import { TransactionService } from '../../../services/transaction.service';
import { CategoryService } from '../../../services/category.service';
import { CategoryModel } from '../../../models/category.model';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../../environments/environment';

describe('TransactionCreateComponent', () => {
  let component: TransactionCreateComponent;
  let fixture: ComponentFixture<TransactionCreateComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockCategoryService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockAngularFirestore: any;

  beforeEach(async () => {
    const mockCategories: CategoryModel[] = [
      { id: '12AB', name: 'Category 1', budget: 500, dueDate: '2024-12-31', userId: '4213' },
      { id: '23CD', name: 'Category 2', budget: 1500, dueDate: '2024-12-31', userId: '1232' }
    ];

    mockCategoryService = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(of(mockCategories)),
      deleteCategory: jasmine.createSpy('deleteCategory').and.returnValue(Promise.resolve())
    };

    mockTransactionService = jasmine.createSpyObj('TransactionService', ['createTransaction']);

    mockActivatedRoute = {
      params: of({ id: '123' })
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockAngularFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of([]))
      })
    };

    await TestBed.configureTestingModule({
      declarations: [TransactionCreateComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      providers: [
        FormBuilder,
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AngularFirestore, useValue: mockAngularFirestore }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.transactionForm.get('name')?.value).toBe('');
    expect(component.transactionForm.get('description')?.value).toBe('');
    expect(component.transactionForm.get('amount')?.value).toBe('');
    expect(component.transactionForm.get('categoryId')?.value).toBe('');
  });

  it('should get categories on start', () => {
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Category 1');
    expect(component.categories[1].name).toBe('Category 2');
  });

  it('should handle drop event', () => {
    const category = { id: '1', name: 'Category 1' };
    component.onDragStart(category);
    const event = new DragEvent('drop');
    component.onDrop(event);
    expect(component.selectedCategory).toEqual(category);
  });

  it('should create transaction and navigate on form submit', () => {
    const mockFormValue = {
      name: 'Test Transaction',
      description: 'Description',
      amount: 100,
      categoryId: '1'
    };

    component.transactionForm.setValue({
      name: mockFormValue.name,
      description: mockFormValue.description,
      amount: mockFormValue.amount,
      categoryId: mockFormValue.categoryId
    });
    component.selectedCategory = { id: '1', name: 'Category 1' };

    const transactionId = 'transaction-id';
    const issuedAt = new Date().toISOString();
    const housekeepingBookId = '123';

    component.onSubmit();

    expect(component.service.createTransaction);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/housekeeping-book/details/123'], {
      queryParams: { orderIssuedAt: 'up' }
    });
  });

  it('should handle drag events correctly', () => {
    const event = new DragEvent('dragover');
    spyOn(event, 'preventDefault');
    component.allowDrop(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
