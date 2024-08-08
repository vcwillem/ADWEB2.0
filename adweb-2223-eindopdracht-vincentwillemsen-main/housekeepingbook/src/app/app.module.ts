import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {
  HousekeepingBookCreate
} from './components/housekeeping-book/housekeeping-book-create/housekeeping-book-create';
import {
  HousekeepingBookListComponent
} from './components/housekeeping-book/housekeeping-book-list/housekeeping-book-list';
import {
  EditHousekeepingBookComponent
} from './components/housekeeping-book/housekeeping-book-edit/housekeeping-book-edit';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore/';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from 'src/environments/environment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  HousekeepingBookListArchived
} from './components/housekeeping-book/housekeeping-book-list-archived/housekeeping-book-list-archived';
import {
  HousekeepingBookDetails
} from './components/housekeeping-book/housekeeping-book-details/housekeeping-book-details';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {DashboardComponent} from './components/user/dashboard/dashboard.component';
import {SignInComponent} from './components/user/sign-in/sign-in.component';
import {AuthService} from './shared/services/auth.service';
import {TransactionCreateComponent} from './components/transaction/transaction-create/transaction-create.component';
import {TransactionEditComponent} from './components/transaction/transaction-edit/transaction-edit.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { CategoryEditComponent } from './components/category/category-edit/category-edit.component';
import { CategoryCreateComponent } from './components/category/category-create/category-create.component';
import { CategoryDetailsComponent } from './components/category/category-details/category-details.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HousekeepingBookCreate,
    HousekeepingBookListComponent,
    EditHousekeepingBookComponent,
    HousekeepingBookListArchived,
    HousekeepingBookDetails,
    DashboardComponent,
    SignInComponent,
    TransactionCreateComponent,
    TransactionEditComponent,
    CategoryEditComponent,
    CategoryCreateComponent,
    CategoryDetailsComponent,
    CategoryListComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService, { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
