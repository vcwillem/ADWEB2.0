import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {HousekeepingBookModel} from '../models/housekeeping-book.model';
import {Observable, Subscriber} from 'rxjs';
import {initializeApp} from "firebase/app";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import {environment} from 'src/environments/environment';
import {AuthService} from 'src/app/shared/services/auth.service';
import {ActivatedRoute} from "@angular/router";

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class HousekeepingBookService {
  constructor(private angularFirestore: AngularFirestore, public authService: AuthService) {
  }

  getHousekeepingBookDoc(id: string) {
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(id)
      .valueChanges()
  }

  getHousekeepingBookList(activatedRoute: ActivatedRoute): Observable<HousekeepingBookModel[]> {
    return new Observable((sub: Subscriber<any>) => {
      onSnapshot(collection(db, "housekeepingbooks"), (snapshot) => {
        const items: HousekeepingBookModel[] = [];

        snapshot.forEach((doc) => {
          let isWhitelisted;
          try {
            isWhitelisted = doc.data()["whitelistedUsers"].includes(this.authService.userData.uid);
          } catch {
            isWhitelisted = false;
          }
          console.log(isWhitelisted);
          if (!doc.data()["isArchived"] && (doc.data()["userId"] == this.authService.userData.uid || isWhitelisted)) {
            items.push({
              id: doc.id,
              name: doc.data()["name"],
              description: doc.data()["description"],
              isArchived: doc.data()["isArchived"],
              userId: doc.data()["userId"]
            })
          }
        })
        sub.next(this.orderHousekeepingBooks(activatedRoute, items));
      })
    });
  }

  getHousekeepingBookListArchived(activatedRoute: ActivatedRoute): Observable<HousekeepingBookModel[]> {
    return new Observable((sub: Subscriber<any>) => {
      onSnapshot(collection(db, "housekeepingbooks"), (snapshot) => {
        const items: HousekeepingBookModel[] = [];

        snapshot.forEach((doc) => {
          if (doc.data()["isArchived"] && doc.data()["userId"] == this.authService.userData.uid) {
            items.push({
              id: doc.id,
              name: doc.data()["name"],
              description: doc.data()["description"],
              isArchived: doc.data()["isArchived"],
              userId: doc.data()["userId"]
            })
          }
        })
        sub.next(this.orderHousekeepingBooks(activatedRoute, items));
      })
    });
  }

  orderHousekeepingBooks(activatedRoute: ActivatedRoute, items: HousekeepingBookModel[]) {
    activatedRoute.queryParams.subscribe(params => {
      if (params["orderDescription"] == "up") {
        items.sort(function(a: HousekeepingBookModel, b: HousekeepingBookModel){
          return a.description.localeCompare(b.description)});
      } else if (params["orderDescription"] == "down") {
        items.sort(function(a: HousekeepingBookModel, b: HousekeepingBookModel){
          return b.description.localeCompare(a.description)});
      }

      if (params["orderName"] == "up") {
        items.sort(function(a: HousekeepingBookModel, b: HousekeepingBookModel){
          return a.name.localeCompare(b.name.toString())});
      } else if (params["orderName"] == "down") {
        items.sort(function(a: HousekeepingBookModel, b: HousekeepingBookModel){
          return b.name.localeCompare(a.name.toString())});
      }
    });
    return items;
  }

  createHousekeepingBook(housekeepingBook: HousekeepingBookModel) {
    housekeepingBook.userId = this.authService.userData.uid;
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
        .collection('housekeepingbooks')
        .add(housekeepingBook)
        .then(response => { console.log(response) }, error => reject(error))
    })
  }

  deleteHousekeepingBook(housekeepingBook: { id: string; }) {
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(housekeepingBook.id)
      .delete()
  }

  updateHousekeepingBook(housekeepingBook: HousekeepingBookModel, id: string) {
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(id)
      .update({
        name: housekeepingBook.name,
        description: housekeepingBook.description,
        isArchived: housekeepingBook.isArchived
      })
  }

  dearchiveHousekeepingBook(id: string) {
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(id)
      .update({
        isArchived: false
      })
  }

  archiveHousekeepingBook(id: string) {
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(id)
      .update({
        isArchived: true
      })
  }
}
