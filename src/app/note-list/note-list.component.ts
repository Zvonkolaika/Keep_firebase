import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service'

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  noteList: Note[] = [];
  favFilter: "all" | "fav" = "all";
  type: "notes" | "trash" = "notes";

  constructor(private noteService: NoteListService) {
    this.noteList = this.getDummyData()
  }

  getList(): Note[] {
    if(this.type == 'notes'){
      return this.noteService.normalNotes;
    } else {
      return this.noteService.trashNotes;
    }
  }

  changeFavFilter(filter: "all" | "fav") {
    this.favFilter = filter;
  }

  changeTrashStatus() {
    if (this.type == "trash") {
      this.type = "notes";
    } else {
      this.type = "trash";
      this.favFilter = "all";
    }
  }

  getDummyData(): Note[] {
    return [
      {
        id: "21sasd561dd4sdf",
        type: "notes",
        title: "Notiz 1",
        content: "Beschreibung 1",
        marked: true,
      },
      {
        id: "25sd4f561w54sdf",
        type: "notes",
        title: "Notiz 2",
        content: `Beschreibung 2`,
        marked: true,
      },
      {
        id: "54a4s6d546ff",
        type: "notes",
        title: "Notiz 3",
        content: "Beschreibung 3",
        marked: false,
      },
      {
        id: "2a35s4d654a6s4d",
        type: "notes",
        title: "Notiz 4",
        content: `Beschreibung 4`,
        marked: true,
      }
    ];
  }

}
