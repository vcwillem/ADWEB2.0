import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HousekeepingBookService} from 'src/app/services/housekeeping-book.service';

@Component({
  selector: 'app-edit-housekeeping-book-details',
  templateUrl: './housekeeping-book-edit.html',
  styleUrls: ['./housekeeping-book-edit.css']
})
export class EditHousekeepingBookComponent {
  public editForm: FormGroup;
  housekeepingBookRef: any;

  constructor(
    public service: HousekeepingBookService,
    public formBuilder: FormBuilder,
    private act: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.formBuilder.group({
      name: [''],
      description: [''],
      isArchived: ['']
    })

    const id = this.act.snapshot.paramMap.get('id')!;

    this.service.getHousekeepingBookDoc(id).subscribe(ref => {
      this.housekeepingBookRef = ref;
      this.editForm = this.formBuilder.group({
        name: [this.housekeepingBookRef.name],
        description: [this.housekeepingBookRef.description],
        isArchived: [this.housekeepingBookRef.isArchived]
      })

      if (this.editForm.value.isArchived) {
        this.router.navigate(['housekeeping-book/list']);
      }
    })
  }

  onSubmit() {
    const id = this.act.snapshot.paramMap.get('id')!;

    this.service.updateHousekeepingBook(this.editForm.value, id);

    if (this.editForm.value.isArchived == true) {
      this.router.navigate(['housekeeping-book/list/archived']);
    } else {
      this.router.navigate(['housekeeping-book/list']);
    }
  }
}
