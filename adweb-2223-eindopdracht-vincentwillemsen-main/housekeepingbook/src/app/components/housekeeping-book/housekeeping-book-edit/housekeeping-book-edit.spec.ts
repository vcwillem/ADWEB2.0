import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EditHousekeepingBookComponent } from './housekeeping-book-edit';
import { HousekeepingBookService } from 'src/app/services/housekeeping-book.service';

describe('EditHousekeepingBookComponent', () => {
  let component: EditHousekeepingBookComponent;
  let fixture: ComponentFixture<EditHousekeepingBookComponent>;
  let mockHousekeepingBookService;
  let mockRouter;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockHousekeepingBookService = jasmine.createSpyObj(['getHousekeepingBookDoc', 'updateHousekeepingBook']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }
    };

    mockHousekeepingBookService.getHousekeepingBookDoc.and.returnValue(of({}));

    mockHousekeepingBookService.updateHousekeepingBook.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [EditHousekeepingBookComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HousekeepingBookService, useValue: mockHousekeepingBookService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditHousekeepingBookComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update housekeeping book and navigate', () => {
    component.editForm.setValue({
      name: 'Updated Book',
      description: 'Updated Description',
      isArchived: false
    });

    component.onSubmit();

    expect(mockHousekeepingBookService.updateHousekeepingBook).toHaveBeenCalledWith(component.editForm.value, '1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['housekeeping-book/list']);
  });

  it('should navigate to archived list on submit if book is archived', () => {
    component.editForm.setValue({
      name: 'Updated Book',
      description: 'Updated Description',
      isArchived: true
    });

    component.onSubmit();

    expect(mockHousekeepingBookService.updateHousekeepingBook).toHaveBeenCalledWith(component.editForm.value, '1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['housekeeping-book/list/archived']);
  });
});
