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

  getUsers(): Observable<UserModel[]> {
    return new Observable((sub: Subscriber<any>) => {
      onSnapshot(collection(db, "users"), (snapshot) => {
        const users: UserModel[] = [];

        snapshot.forEach((doc) => {
          if (this.authService.userData.uid != doc.id) {
            users.push({
              id: doc.id,
              name: doc.data()["displayName"],
            })
          }
        })
        sub.next(users);
      })
    });
  }
}
