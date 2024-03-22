import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, docSnapshots, DocumentReference, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  unsubNotes;
  unsubTrash;

  normalNotes: Note[] = [];
  trashNotes: Note[] = [];

  // items$;
  // items;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();

    // this.items$ = collectionData(this.getNotesRef()); 
    // this.items = this.items$.subscribe( (list: any) => {
    //   list.forEach((element: any) => {
    //     console.log(element);
    //   });
    // })
  }

  async deleteNote(colID: "note" | "trash", docID: string){
    await deleteDoc(this.getSingleNoteRef(colID, docID)).catch(
      (err) => { console.error(err) }
    );
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleNoteRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJSON(note)).catch(
        (err) => { console.error(err) }
      );
    }
  }

  getCleanJSON(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    } 
  }

  getColIdFromNote(note: Note) {
    if (note.type == "notes") {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colID: "notes" | "trash") {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Note added", docRef?.id) }
    )
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    //this.items.unsubscribe();
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string) {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleNoteRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }
}
