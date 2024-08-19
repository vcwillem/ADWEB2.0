import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {CategoryEditComponent} from './category-edit.component';
import {CategoryService} from '../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';

describe('CategoryEditComponent', () => {
  let component: CategoryEditComponent;
  let fixture: ComponentFixture<CategoryEditComponent>;
  let mockCategoryService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockCategoryService = {
      getCategoryDoc: jasmine.createSpy('getCategoryDoc').and.returnValue(of({
        name: 'Test Category',
        budget: 1000,
        dueDate: '2024-12-31'
      })),
      updateCategory: jasmine.createSpy('updateCategory').and.returnValue(Promise.resolve())
    };

    mockActivatedRoute = {
      params: of({id: '12AB'})
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [CategoryEditComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        {provide: CategoryService, useValue: mockCategoryService},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill the page with testdata', () => {
    expect(component.editForm.value.name).toEqual('Test Category');
    expect(component.editForm.value.budget).toEqual(1000);
    expect(component.editForm.value.dueDate).toEqual('2024-12-31');
  });

  it('should call updateCategory on submit', () => {
    component.onSubmit();
    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(component.editForm.value, '12AB');
  });

  it('should navigate on submit', () => {
    component.onSubmit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/category/list']);
  });
});
