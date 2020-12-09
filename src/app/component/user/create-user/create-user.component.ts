import {Component, OnInit} from '@angular/core';
import {UseService} from '../../../_service/use.service';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RoleService} from '../../../_service/role.service';
import {Role} from '../../../_model/role';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogComponent} from '../../base_component/dialog/dialog.component';
import {User} from '../../../_model/user';

@Component({
  selector: 'app-create-user',
  templateUrl: 'create-user.component.html',
  styleUrls: ['create-user.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateUserComponent implements OnInit {
  id: number;
  userForm: FormGroup;
  submitted = false;
  roles: Role[];
  grades: string[] = ['grade 1', 'grade 2', 'grade 3'];
  editor = ClassicEditor;

  isIntruder = true;
  user: User;

  ngOnInit(): void {
    this.resetForm();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getAllRoles();
    if (this.id !== undefined) {
      this.getUserDetail(this.id);
    }
  }

  private getAllRoles(): void {
    this.roleService.getAllRole().subscribe(value => {
      this.roles = value;
    });
  }

  private getUserDetail(userId: number): void {
    this.userService.getUserDetail(userId).subscribe(value => {
      console.log(value);
      this.userForm.patchValue(value);
    });
  }

  constructor(
    private fb: FormBuilder,
    private userService: UseService,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  resetForm(): void {
    this.userForm = this.fb.group({
      username: this.fb.control(''),
      password: this.fb.control(''),
      confirmPassword: this.fb.control(''),
      firstName: this.fb.control(''),
      lastName: this.fb.control(''),
      email: this.fb.control(''),
      phoneNumber: this.fb.control(''),
      roles: this.fb.control(''),
      instructorDetail: this.fb.group({
        aboutMe: this.fb.control(''),
        facebookLink: this.fb.control(''),
        twitterLink: this.fb.control(''),
        youtubeLink: this.fb.control(''),
        achievement: this.fb.control('')
      }),
      studentDetail: this.fb.group({
        grade: this.fb.control(''),
        school: this.fb.control('')
      })
    });
  }

  checkIntruder($event): void {
    this.isIntruder = $event.checked;
  }

  createNewUser(): void {
    this.user = this.userForm.value;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: 'lesson'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.userService.insertOrUpdate(this.user).subscribe(value => {
          this.user = value;
          this.openSnackBar('Success', 'Oke');
        });
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
