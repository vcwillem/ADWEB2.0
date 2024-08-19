import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HousekeepingBookCreate } from './housekeeping-book-create';
import { HousekeepingBookService } from 'src/app/services/housekeeping-book.service';
import { UserService } from 'src/app/services/user.service';

describe('HousekeepingBookCreate', () => {
  let component: HousekeepingBookCreate;
  let fixture: ComponentFixture<HousekeepingBookCreate>;
  let mockHousekeepingBookService;
  let mockUserService;
  let mockRouter;

  beforeEach(async () => {
    mockHousekeepingBookService = jasmine.createSpyObj(['createHousekeepingBook']);
    mockUserService = jasmine.createSpyObj(['getUsers']);
    mockRouter = jasmine.createSpyObj(['navigate']);


    mockHousekeepingBookService.createHousekeepingBook.and.returnValue(of({}));

    mockUserService.getUsers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [HousekeepingBookCreate],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HousekeepingBookService, useValue: mockHousekeepingBookService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HousekeepingBookCreate);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start the form with default values', () => {
    fixture.detectChanges();
    const form = component.housekeepingbookForm;

    expect(form).toBeDefined();
    expect(form.get('name')?.value).toEqual('');
    expect(form.get('description')?.value).toEqual('');
    expect(form.get('whitelistedUsers')?.value).toEqual('');
    expect(form.get('isArchived')?.value).toEqual(false);
  });

  it('should get users and fill in users data', () => {
    const usersMockData = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
    mockUserService.getUsers.and.returnValue(of(usersMockData));

    fixture.detectChanges();  // triggers ngOnInit

    expect(mockUserService.getUsers).toHaveBeenCalled();
  });

  it('should create housekeeping book on submit and navigate to list', () => {
    const formValue = {
      name: 'Test Book',
      description: 'Test Description',
      whitelistedUsers: [],
      isArchived: false
    };
    component.housekeepingbookForm.setValue(formValue);

    component.onSubmit();

    expect(mockHousekeepingBookService.createHousekeepingBook).toHaveBeenCalledWith(formValue);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['housekeeping-book/list']);
  });
});
