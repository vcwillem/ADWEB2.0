import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CategoryListComponent } from './category-list.component';
import { CategoryService } from '../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import { CategoryModel } from '../../../models/category.model';
import {CategoryEditComponent} from "../category-edit/category-edit.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let mockCategoryService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    const mockCategories: CategoryModel[] = [
      { id: '12AB', name: 'Category 1', budget: 500, dueDate: '2024-12-31', userId: '4213' },
      { id: '23CD', name: 'Category 2', budget: 1500, dueDate: '2024-12-31', userId: '1232' }
    ];

    mockCategoryService = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(of(mockCategories)),
      deleteCategory: jasmine.createSpy('deleteCategory').and.returnValue(Promise.resolve())
    };

    mockActivatedRoute = {};

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [ CategoryEditComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch categories on initialization', () => {
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Category 1');
    expect(component.categories[1].name).toBe('Category 2');
  });

  it('should call delete when invoked', () => {
    const categoryToDelete: CategoryModel = { id: '1', name: 'Category 1', budget: 500, dueDate: '2024-12-31', userId: '4213' };
    spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog

    component.deleteCategory(categoryToDelete);

    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(categoryToDelete);
  });

  it('should not call delete when declined', () => {
    const categoryToDelete: CategoryModel = { id: '1', name: 'Category 1', budget: 500, dueDate: '2024-12-31', userId: '4213' };
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteCategory(categoryToDelete);

    expect(mockCategoryService.deleteCategory).not.toHaveBeenCalled();
  });
});
