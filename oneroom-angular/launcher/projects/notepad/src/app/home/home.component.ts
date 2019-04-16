import { Component, OnInit } from '@angular/core';
import { Note } from './note';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  notes: Note[] = localStorage.getItem('notes') != null ? JSON.parse(localStorage.getItem('notes')) : [];
  currentTitle = '';
  currentDescription = '';
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  constructor() { }

  ngOnInit() {
    console.log(this.notes);
  }
  addNote() {
    const newNote = new Note();
    newNote.date = new Date().toLocaleDateString('fr-FR', this.options);
    newNote.title = this.currentTitle;
    newNote.description = this.currentDescription;
    this.notes.push(newNote);
    this.currentTitle = '';
    this.currentDescription = '';
    console.log(JSON.stringify(this.notes));
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
  removeNote(num: number) {
    this.notes.splice(num, 1);
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    console.log('destroy note');
  }
}
