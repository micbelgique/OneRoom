import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-description-team-modal',
  templateUrl: './description-team-modal.component.html',
  styleUrls: ['./description-team-modal.component.css']
})
export class DescriptionTeamModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DescriptionTeamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
