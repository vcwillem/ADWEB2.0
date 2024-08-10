import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Observable, Subscriber} from 'rxjs';
import {initializeApp} from "firebase/app";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import {environment} from 'src/environments/environment';
import {AuthService} from 'src/app/shared/services/auth.service';
import {ActivatedRoute} from "@angular/router";
import {TransactionModel} from "../models/transaction.model";

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private angularFirestore: AngularFirestore, public authService: AuthService) { }

  getTransactionDoc(transactionId: string, housekeepingBookId: string) {
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(housekeepingBookId)
      .collection('transactions')
      .doc(transactionId)
      .valueChanges()
  }

  getTransactionList(housekeepingBookId: string, activatedRoute: ActivatedRoute): Observable<TransactionModel[]> {
    return new Observable((sub: Subscriber<any>) => {
      onSnapshot(collection(db, "housekeepingbooks", housekeepingBookId, "transactions"), (snapshot) => {
        const items: TransactionModel[] = [];

        snapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              name: doc.data()["name"],
              description: doc.data()["description"],
              issuedAt: doc.data()["issuedAt"],
              amount: doc.data()["amount"],
              categoryId: doc.data()["categoryId"],
              housekeepingBookId: housekeepingBookId,
            })
        })
        sub.next(this.orderTransactionsBooks(activatedRoute, items));
      })
    });
  }

  orderTransactionsBooks(activatedRoute: ActivatedRoute, items: TransactionModel[]) {
    activatedRoute.queryParams.subscribe(params => {
      if (params["orderName"] == "up") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          return a.name.localeCompare(b.name.toString())});
      } else if (params["orderName"] == "down") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          return b.name.localeCompare(a.name.toString())});
      }

      if (params["orderDescription"] == "up") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          return a.description.localeCompare(b.description)});
      } else if (params["description"] == "down") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          return b.description.localeCompare(a.description)});
      }

      if (params["orderIssuedAt"] == "down") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          return a.issuedAt.localeCompare(b.issuedAt.toString())});
      } else if (params["orderIssuedAt"] == "up") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          return b.issuedAt.localeCompare(a.issuedAt.toString())});
      }

      if (params["orderAmount"] == "up") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          if (a.amount < b.amount) {
            return 1;
          } else if (a.amount == b.amount) {
            return 0;
          } else {
            return -1;
          }});
      } else if (params["orderAmount"] == "down") {
        items.sort(function(a: TransactionModel, b: TransactionModel){
          if (a.amount > b.amount) {
            return 1;
          } else if (a.amount == b.amount) {
            return 0;
          } else {
            return -1;
          }});
      }
    });
    return items;
  }

  createTransaction(transaction: TransactionModel, housekeepingBookId: string, categoryId: string) {
    transaction.categoryId = categoryId;
    transaction.issuedAt = Date().toLocaleString();
    transaction.housekeepingBookId = housekeepingBookId;
    console.log(transaction)
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
        .collection('housekeepingbooks')
        .doc(housekeepingBookId)
        .collection('transactions')
        .add(transaction)
        .then(response => { console.log(response) }, error => reject(error))
    })
  }

  deleteTransaction(transactionId: string, housekeepingBookId: string) {
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(housekeepingBookId)
      .collection('transactions')
      .doc(transactionId)
      .delete()
  }

  updateTransaction(transaction: TransactionModel, transactionId: string, housekeepingBookId: string) {
    transaction.issuedAt = Date().toLocaleString();
    return this.angularFirestore
      .collection('housekeepingbooks')
      .doc(housekeepingBookId)
      .collection('transactions')
      .doc(transactionId)
      .update({
        name: transaction.name,
        description: transaction.description,
        amount: transaction.amount,
        categoryId: transaction.categoryId
      })
  }
}
