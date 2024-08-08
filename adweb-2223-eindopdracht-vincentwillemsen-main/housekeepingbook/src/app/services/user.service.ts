import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "../shared/services/auth.service";
import {UserModel} from "../models/user.model";
import {Observable, Subscriber} from "rxjs";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import firebase from "firebase/compat";
import User = firebase.User;

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private angularFirestore: AngularFirestore, public authService: AuthService) {
  }

  getUsers(activatedRoute: ActivatedRoute): Observable<UserModel[]> {
    return new Observable((sub: Subscriber<any>) => {
      onSnapshot(collection(db, "users"), (snapshot) => {
        const items: UserModel[] = [];

        snapshot.forEach((doc) => {
          if (doc.data()["userId"] == this.authService.userData.uid) {
            items.push({
              id: doc.id,
              name: doc.data()["displayName"],
            })
          }
        })
      })
    });
  }
}
