import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Trip } from '../interfaces/trip';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private tripsCollection: AngularFirestoreCollection<Trip>;

  constructor(private afs: AngularFirestore) {
    this.tripsCollection = this.afs.collection<Trip>('Trips');
  }

  getTrips() {
    return this.tripsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addTrip(trip: Trip) {
    return this.tripsCollection.add(trip);
  }

  getTrip(id: string) {
    return this.tripsCollection.doc<Trip>(id).valueChanges();
  }

  updateTrip(id: string, trip: Trip) {
    return this.tripsCollection.doc<Trip>(id).update(trip);
  }

  deleteTrip(id: string) {
    return this.tripsCollection.doc(id).delete();
  }
}