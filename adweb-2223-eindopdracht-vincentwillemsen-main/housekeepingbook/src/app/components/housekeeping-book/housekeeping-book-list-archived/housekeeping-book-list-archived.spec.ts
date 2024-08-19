import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HousekeepingBookListArchived } from './housekeeping-book-list-archived';
import { HousekeepingBookService } from 'src/app/services/housekeeping-book.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HousekeepingBookModel } from 'src/app/models/housekeeping-book.model';

describe('HousekeepingBookListArchived', () => {
  let component: HousekeepingBookListArchived;
  let fixture: ComponentFixture<HousekeepingBookListArchived>;
  let mockHousekeepingBookService;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockHousekeepingBookService = jasmine.createSpyObj([
      'getHousekeepingBookListArchived',
      'deleteHousekeepingBook',
      'dearchiveHousekeepingBook'
    ]);

    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }
    };

    mockHousekeepingBookService.getHousekeepingBookListArchived.and.returnValue(of([]));
    mockHousekeepingBookService.dearchiveHousekeepingBook.and.returnValue(of({}));
    mockHousekeepingBookService.deleteHousekeepingBook.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [HousekeepingBookListArchived],
      providers: [
        { provide: HousekeepingBookService, useValue: mockHousekeepingBookService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HousekeepingBookListArchived);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and fill in housekeeping books on start', () => {
    const archivedHousekeepingBooksMock: HousekeepingBookModel[] = [
      { id: '1', name: 'Archived Book 1', description: 'Description 1', isArchived: true, userId: '3' },
      { id: '2', name: 'Archived Book 2', description: 'Description 2', isArchived: true, userId: '4'  }
    ];

    mockHousekeepingBookService.getHousekeepingBookListArchived.and.returnValue(of(archivedHousekeepingBooksMock));

    fixture.detectChanges();

    expect(mockHousekeepingBookService.getHousekeepingBookListArchived).toHaveBeenCalledWith(mockActivatedRoute);
  });

  it('should confirm and delete a housekeeping book', () => {
    const housekeepingBook = { id: '1', name: 'Archived Book 1', description: 'Description 1', isArchived: true };
    spyOn(window, 'confirm').and.returnValue(true);

    component.removeHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete: Archived Book 1');
    expect(mockHousekeepingBookService.deleteHousekeepingBook).toHaveBeenCalledWith(housekeepingBook);
  });

  it('should dearchive a housekeeping book', () => {
    const housekeepingBook = { id: '1', name: 'Archived Book 1', description: 'Description 1', isArchived: true };
    spyOn(window, 'confirm').and.returnValue(true);

    component.dearchiveHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Dearchive this housekeeping book? Archived Book 1');
    expect(mockHousekeepingBookService.dearchiveHousekeepingBook).toHaveBeenCalledWith(housekeepingBook.id);
  });

  it('should not delete a housekeeping book if confirm is cancelled', () => {
    const housekeepingBook = { id: '1', name: 'Archived Book 1', description: 'Description 1', isArchived: true };
    spyOn(window, 'confirm').and.returnValue(false);

    component.removeHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete: Archived Book 1');
    expect(mockHousekeepingBookService.deleteHousekeepingBook).not.toHaveBeenCalled();
  });

  it('should not dearchive a housekeeping book if confirm is cancelled', () => {
    const housekeepingBook = { id: '1', name: 'Archived Book 1', description: 'Description 1', isArchived: true };
    spyOn(window, 'confirm').and.returnValue(false);

    component.dearchiveHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Dearchive this housekeeping book? Archived Book 1');
    expect(mockHousekeepingBookService.dearchiveHousekeepingBook).not.toHaveBeenCalled();
  });
});
