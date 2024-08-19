import {Component} from '@angular/core';
import {HousekeepingBookModel} from 'src/app/models/housekeeping-book.model';
import {HousekeepingBookService} from 'src/app/services/housekeeping-book.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-housekeeping-book-list-archived',
  templateUrl: './housekeeping-book-list-archived.html',
  styleUrls: ['./housekeeping-book-list-archived.css']
})
export class HousekeepingBookListArchived {
  housekeepingbooks: HousekeepingBookModel[] = [];
  service: HousekeepingBookService

  constructor(public activatedRoute: ActivatedRoute, service: HousekeepingBookService) {
    this.service = service;
    service.getHousekeepingBookListArchived(activatedRoute).subscribe(housekeepingbooks => this.housekeepingbooks = housekeepingbooks)
  }

  removeHousekeepingBook(housekeepingbook) {
    if (confirm("Are you sure you want to delete: " + housekeepingbook.name)) {
      this.service.deleteHousekeepingBook(housekeepingbook);
    }
  }

  dearchiveHousekeepingBook(housekeepingbook) {
    if (confirm("Dearchive this housekeeping book? " + housekeepingbook.name)) {
      this.service.dearchiveHousekeepingBook(housekeepingbook.id);
    }
  }
}
