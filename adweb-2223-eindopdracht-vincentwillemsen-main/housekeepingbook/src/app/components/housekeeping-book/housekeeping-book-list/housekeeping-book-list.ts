import {Component} from '@angular/core';
import {HousekeepingBookModel} from '../../../models/housekeeping-book.model';
import {HousekeepingBookService} from '../../../services/housekeeping-book.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-housekeeping-book-list',
  templateUrl: './housekeeping-book-list.html',
  styleUrls: ['./housekeeping-book-list.css']
})
export class HousekeepingBookListComponent {
  housekeepingbooks: HousekeepingBookModel[] = [];
  service: HousekeepingBookService;

  constructor(public activatedRoute: ActivatedRoute, service: HousekeepingBookService) {
    this.service = service;
    service.getHousekeepingBookList(activatedRoute).subscribe(housekeepingbooks => this.housekeepingbooks = housekeepingbooks)
  }

  archiveHousekeepingBook(housekeepingbook) {
    if (confirm("Do you want to archive " + housekeepingbook.name)) {
      this.service.archiveHousekeepingBook(housekeepingbook.id);
    }
  }

  deleteHousekeepingBook(housekeepingbook) {
    if (confirm("Remove " + housekeepingbook.name)) {
      this.service.deleteHousekeepingBook(housekeepingbook);
    }
  }
}
