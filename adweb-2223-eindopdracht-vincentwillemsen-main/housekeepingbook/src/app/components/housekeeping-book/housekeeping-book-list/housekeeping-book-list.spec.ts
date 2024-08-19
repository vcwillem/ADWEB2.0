import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HousekeepingBookListComponent } from './housekeeping-book-list';
import { HousekeepingBookService } from '../../../services/housekeeping-book.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HousekeepingBookModel } from '../../../models/housekeeping-book.model';

describe('HousekeepingBookListComponent', () => {
  let component: HousekeepingBookListComponent;
  let fixture: ComponentFixture<HousekeepingBookListComponent>;
  let mockHousekeepingBookService;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockHousekeepingBookService = jasmine.createSpyObj([
      'getHousekeepingBookList',
      'archiveHousekeepingBook',
      'deleteHousekeepingBook'
    ]);

    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }
    };

    mockHousekeepingBookService.getHousekeepingBookList.and.returnValue(of([]));
    mockHousekeepingBookService.archiveHousekeepingBook.and.returnValue(of({}));
    mockHousekeepingBookService.deleteHousekeepingBook.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [HousekeepingBookListComponent],
      providers: [
        { provide: HousekeepingBookService, useValue: mockHousekeepingBookService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HousekeepingBookListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and fill in housekeeping books on start', () => {
    const housekeepingBooksMock: HousekeepingBookModel[] = [
      { id: '1', name: 'Book 1', description: 'Description 1', isArchived: false, userId: '3' },
      { id: '2', name: 'Book 2', description: 'Description 2', isArchived: false, userId: '4' }
    ];

    mockHousekeepingBookService.getHousekeepingBookList.and.returnValue(of(housekeepingBooksMock));

    fixture.detectChanges();

    expect(mockHousekeepingBookService.getHousekeepingBookList).toHaveBeenCalledWith(mockActivatedRoute);
  });

  it('should archive a housekeeping book', () => {
    const housekeepingBook = { id: '1', name: 'Book 1', description: 'Description 1', isArchived: false };
    spyOn(window, 'confirm').and.returnValue(true);

    component.archiveHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Do you want to archive Book 1');
    expect(mockHousekeepingBookService.archiveHousekeepingBook).toHaveBeenCalledWith('1');
  });

  it('should delete a housekeeping book', () => {
    const housekeepingBook = { id: '1', name: 'Book 1', description: 'Description 1', isArchived: false };
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Remove Book 1');
    expect(mockHousekeepingBookService.deleteHousekeepingBook).toHaveBeenCalledWith(housekeepingBook);
  });

  it('should not archive a housekeeping book if confirm is cancelled', () => {
    const housekeepingBook = { id: '1', name: 'Book 1', description: 'Description 1', isArchived: false };
    spyOn(window, 'confirm').and.returnValue(false);

    component.archiveHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Do you want to archive Book 1');
    expect(mockHousekeepingBookService.archiveHousekeepingBook).not.toHaveBeenCalled();
  });

  it('should not delete a housekeeping book if confirm is cancelled', () => {
    const housekeepingBook = { id: '1', name: 'Book 1', description: 'Description 1', isArchived: false };
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteHousekeepingBook(housekeepingBook);

    expect(window.confirm).toHaveBeenCalledWith('Remove Book 1');
    expect(mockHousekeepingBookService.deleteHousekeepingBook).not.toHaveBeenCalled();
  });
});
