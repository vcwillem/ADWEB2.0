import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HousekeepingBookService} from 'src/app/services/housekeeping-book.service';
import firebase from "firebase/compat";
import {UserModel} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-housekeeping-book-create',
  templateUrl: './housekeeping-book-create.html',
  styleUrls: ['./housekeeping-book-create.css']
})
export class HousekeepingBookCreate {
  public housekeepingbookForm: FormGroup;
  public users;
  public userService: UserService;
  private whitelistedUsers: UserModel[];

  constructor(
    public service: HousekeepingBookService,
    public formBuilder: FormBuilder,
    public router: Router,
    userService: UserService
  ) {
    this.userService = userService;
    this.housekeepingbookForm = this.formBuilder.group({
      name: [''],
      description: [''],
      whitelistedUsers: [''],
      isArchived: [false]
    });
    this.userService.getUsers().subscribe(users => { this.users = users; });
  }


  onSubmit(){
    this.service.createHousekeepingBook(this.housekeepingbookForm.value);
    this.router.navigate(['housekeeping-book/list']);
  }
}
