import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CategoryCreateComponent} from './category-create.component';
import {CategoryService} from '../../../services/category.service';
import {CategoryModel} from '../../../models/category.model';

describe('CategoryCreateComponent', () => {
  let component: CategoryCreateComponent;
  let fixture: ComponentFixture<CategoryCreateComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['createCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CategoryCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: CategoryService, useValue: mockCategoryService},
        {provide: Router, useValue: mockRouter},
        FormBuilder
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize empty', () => {
    const form = component.categoryForm;
    expect(form.get('name')?.value).toBe('');
    expect(form.get('budget')?.value).toBe('');
    expect(form.get('dueDate')?.value).toBe('');
  });

  it('should create when submitting form', () => {
    const formValue = {
      name: 'Test Category',
      budget: 100,
      dueDate: '2024-08-15'
    };

    component.categoryForm.setValue(formValue);
    component.onSubmit();

    expect(mockCategoryService.createCategory).toHaveBeenCalledWith(jasmine.objectContaining({
      name: formValue.name,
      budget: formValue.budget,
      dueDate: formValue.dueDate
    }));
  });

  it('should navigate to list after submission', () => {
    const formValue: CategoryModel = {
      id: '123',
      name: 'Test Category',
      budget: 100,
      dueDate: '2024-08-15',
      userId: '456'
    };
    component.categoryForm.setValue({
      name: formValue.name,
      budget: formValue.budget,
      dueDate: formValue.dueDate
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/category/list']);
  });
});
