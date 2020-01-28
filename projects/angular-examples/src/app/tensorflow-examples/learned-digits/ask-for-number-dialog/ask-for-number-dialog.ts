import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AskForNumberDialogData} from './ask-for-number-dialog-data';

@Component({
  selector: 'app-ask-for-number-dialog',
  templateUrl: './ask-for-number-dialog.html',
})
export class AskForNumberDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AskForNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AskForNumberDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
