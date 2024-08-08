import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HousekeepingBookService} from 'src/app/services/housekeeping-book.service';
import firebase from "firebase/compat";
import User = firebase.User;

@Component({
  selector: 'app-housekeeping-book-create',
  templateUrl: './housekeeping-book-create.html',
  styleUrls: ['./housekeeping-book-create.css']
})
export class HousekeepingBookCreate {
  public housekeepingbookForm: FormGroup;
  public existingUsers: User;

  constructor(
    public service: HousekeepingBookService,
    public formBuilder: FormBuilder,
    public router: Router
  ) {
    this.housekeepingbookForm = this.formBuilder.group({
      name: [''],
      description: [''],
      whitelistedUsers: [''],
      isArchived: [false]
    })
  }


  onSubmit(){
    this.service.createHousekeepingBook(this.housekeepingbookForm.value);
    this.router.navigate(['housekeeping-book/list']);
  }
}
