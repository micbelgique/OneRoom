import { Component, OnInit, Inject } from '@angular/core';
import { User } from '@oneroomic/oneroomlibrary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-change-name',
  templateUrl: './modal-change-name.component.html',
  styleUrls: ['./modal-change-name.component.css']
})
export class ModalChangeNameComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalChangeNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
