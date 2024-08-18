import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "../shared/services/auth.service";
import {CategoryModel} from "../models/category.model";
import {Observable, Subscriber} from "rxjs";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private angularFirestore: AngularFirestore, public authService: AuthService) {
  }

  getCategoryDoc(id: string) {
    return this.angularFirestore
      .collection('categories')
      .doc(id)
      .valueChanges()
  }

  createCategory(category: CategoryModel) {
    category.userId = this.authService.userData.uid;
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
        .collection('categories')
        .add(category)
        .then(response => { console.log(response) }, error => reject(error))
    })
  }

  getCategories(activatedRoute: ActivatedRoute): Observable<CategoryModel[]> {
    return new Observable((sub: Subscriber<any>) => {
      onSnapshot(collection(db, "categories"), (snapshot) => {
        const items: CategoryModel[] = [];

        snapshot.forEach((doc) => {
          if (doc.data()["userId"] == this.authService.userData.uid) {
            items.push({
              id: doc.id,
              name: doc.data()["name"],
              budget: doc.data()["budget"],
              dueDate: doc.data()["dueDate"],
              userId: doc.data()["userId"]
            })
          }
        })
        sub.next(this.orderCategories(activatedRoute, items));
      })
    });
  }

  orderCategories(activatedRoute: ActivatedRoute, items: CategoryModel[]) {
    activatedRoute.queryParams.subscribe(params => {
      if (params["orderName"] == "up") {
        items.sort(function (a: CategoryModel, b: CategoryModel) {
          return a.name.localeCompare(b.name)
        });
      } else if (params["orderName"] == "down") {
        items.sort(function (a: CategoryModel, b: CategoryModel) {
          return b.name.localeCompare(a.name)
        });
      }

      if (params["orderBudget"] == "up") {
        items.sort(function (a: CategoryModel, b: CategoryModel) {
          if (a.budget < b.budget) {
            return 1;
          } else if (a.budget == b.budget) {
            return 0;
          } else {
            return -1;
          }
        });
      } else if (params["orderBudget"] == "down") {
        items.sort(function (a: CategoryModel, b: CategoryModel) {
          if (a.budget > b.budget) {
            return 1;
          } else if (a.budget == b.budget) {
            return 0;
          } else {
            return -1;
          }
        });
      }

      if (params["orderDueDate"] == "up") {
        items.sort(function (a: CategoryModel, b: CategoryModel) {
          return a.dueDate.localeCompare(b.dueDate)
        });
      } else if (params["orderDueDate"] == "down") {
        items.sort(function (a: CategoryModel, b: CategoryModel) {
          return b.dueDate.localeCompare(a.dueDate)
        });
      }
    });

    return items;
  }

  deleteCategory(category: CategoryModel) {
    return this.angularFirestore
      .collection('categories')
      .doc(category.id)
      .delete()
  }

  updateCategory(category: CategoryModel, id: string) {
    return this.angularFirestore
      .collection('categories')
      .doc(id)
      .update({
        name: category.name,
        budget: category.budget,
        dueDate: category.dueDate
      })
  }
}
