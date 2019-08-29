import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserDetails } from '../interfaces/user-details';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private userDetailsCollection: AngularFirestoreCollection<UserDetails>;

  constructor(private afs: AngularFirestore) {
    this.userDetailsCollection = this.afs.collection<UserDetails>('UserDetails');
  }

  getUsers() {
    return this.userDetailsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addUser(userDetails: UserDetails) {
    return this.userDetailsCollection.add(userDetails);
  }

  getUser(id: string) {
    return this.userDetailsCollection.doc<UserDetails>(id).valueChanges();
  }

  updateUser(id: string, user: UserDetails) {
    return this.userDetailsCollection.doc<UserDetails>(id).update(user);
  }

  deleteUser(id: string) {
    return this.userDetailsCollection.doc(id).delete();
  }
}