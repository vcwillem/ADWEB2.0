import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HousekeepingBookCreate} from "./housekeeping-book-create";

describe('HousekeepingBookCreateComponent', () => {
  let component: HousekeepingBookCreate;
  let fixture: ComponentFixture<HousekeepingBookCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousekeepingBookCreate ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousekeepingBookCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
