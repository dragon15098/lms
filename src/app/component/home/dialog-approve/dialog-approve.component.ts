import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course, CourseStatus} from '../../../_model/course';
import {CourseService} from '../../../_service/course.service';

@Component({
  selector: 'app-dialog-approve',
  templateUrl: 'dialog-approve.component.html',
})
export class DialogApproveComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogApproveComponent>,
    @Inject(MAT_DIALOG_DATA) public price: number) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
