import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {CategoryService} from '../../../services/category.service';
import {CategoryDetailsComponent} from "./category-details.component";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute, Router} from "@angular/router";

describe('CategoryDetailsComponent', () => {
  let component: CategoryDetailsComponent;
  let fixture: ComponentFixture<CategoryDetailsComponent>;
  let mockCategoryService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockCategoryService = {
      getCategoryDoc: jasmine.createSpy('getCategoryDoc').and.returnValue(of({
        id: '12AB',
        name: 'Test Category',
        budget: 1000,
        dueDate: '2024-12-31'
      })),
    };

    mockActivatedRoute = {
      params: of({id: '12AB'})
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [CategoryDetailsComponent],
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
    fixture = TestBed.createComponent(CategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill the page with testdata', () => {
    expect(component.categoryDetails.value.name).toEqual('Test Category');
    expect(component.categoryDetails.value.budget).toEqual(1000);
    expect(component.categoryDetails.value.dueDate).toEqual('2024-12-31');
  });

  it('should call the correct values upon submit', () => {
    expect(mockCategoryService.getCategoryDoc).toHaveBeenCalledWith('12AB');
  });
});
