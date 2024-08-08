import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  HousekeepingBookListComponent
} from './components/housekeeping-book/housekeeping-book-list/housekeeping-book-list';
import {
  HousekeepingBookCreate
} from './components/housekeeping-book/housekeeping-book-create/housekeeping-book-create';
import {
  EditHousekeepingBookComponent
} from './components/housekeeping-book/housekeeping-book-edit/housekeeping-book-edit';
import {
  HousekeepingBookListArchived
} from './components/housekeeping-book/housekeeping-book-list-archived/housekeeping-book-list-archived';
import {
  HousekeepingBookDetails
} from './components/housekeeping-book/housekeeping-book-details/housekeeping-book-details';

import {HomeComponent} from "./components/home/home.component";
import {SignInComponent} from './components/user/sign-in/sign-in.component';
import {DashboardComponent} from './components/user/dashboard/dashboard.component';
import {AuthGuard} from './shared/guard/auth.guard';
import {TransactionCreateComponent} from "./components/transaction/transaction-create/transaction-create.component";
import {TransactionEditComponent} from "./components/transaction/transaction-edit/transaction-edit.component";
import {CategoryCreateComponent} from "./components/category/category-create/category-create.component";
import {CategoryListComponent} from "./components/category/category-list/category-list.component";
import {CategoryEditComponent} from "./components/category/category-edit/category-edit.component";
import {CategoryDetailsComponent} from "./components/category/category-details/category-details.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'user/sign-in', component: SignInComponent},
  {path: 'user/dashboard', component: DashboardComponent, canActivate: [AuthGuard]},

  {path: 'housekeeping-book/create', component: HousekeepingBookCreate, canActivate: [AuthGuard]},
  {path: 'housekeeping-book/list', component: HousekeepingBookListComponent, canActivate: [AuthGuard]},
  {path: 'housekeeping-book/list/archived', component: HousekeepingBookListArchived, canActivate: [AuthGuard]},
  {path: 'housekeeping-book/edit/:id', component: EditHousekeepingBookComponent, canActivate: [AuthGuard]},
  {path: 'housekeeping-book/details/:id', component: HousekeepingBookDetails, canActivate: [AuthGuard]},

  {path: 'housekeeping-book/details/:id/transaction/create', component: TransactionCreateComponent, canActivate: [AuthGuard]},
  {path: 'housekeeping-book/details/:id/transaction/edit/:transactionid', component: TransactionEditComponent, canActivate: [AuthGuard]},

  {path: 'category/create', component: CategoryCreateComponent, canActivate: [AuthGuard]},
  {path: 'category/list', component: CategoryListComponent, canActivate: [AuthGuard]},
  {path: 'category/edit/:id', component: CategoryEditComponent, canActivate: [AuthGuard]},
  {path: 'category/details/:id', component: CategoryDetailsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
