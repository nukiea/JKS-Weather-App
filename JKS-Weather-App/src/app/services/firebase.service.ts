import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Report } from '../model/report.model'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private reportsCollection: AngularFirestoreCollection<Report>;
  reports: Observable<Report[]>;

  constructor(private afs: AngularFirestore) {
    this.reportsCollection = this.afs.collection<Report>('reports');
    this.reports = this.reportsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Report;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addItem(report: Report): Promise<DocumentReference> {
    return this.reportsCollection.add(report);
  }

  getItems(): Observable<Report[]> {
    return this.reports;
  }

  getItem(id: string): Observable<Report> {
    return this.reportsCollection.doc(id).valueChanges() as Observable<Report>;
  }

  updateItem(id: string, report: Report): Promise<void> {
    return this.reportsCollection.doc(id).update(report);
  }

  deleteItem(id: string): Promise<void> {
    return this.reportsCollection.doc(id).delete();
  }
}
