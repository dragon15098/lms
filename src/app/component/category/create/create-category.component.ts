import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, FormGroup} from '@angular/forms';
import {Category} from '../../../_model/category';
import {CategoryService} from '../../../_service/category.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogComponent} from '../../base_component/dialog/dialog.component';

@Component({
  selector: 'app-create-category',
  templateUrl: 'create-category.component.html',
  styleUrls: ['create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  createForm: FormGroup;
  dataSource = new MatTableDataSource<Category>();
  submitted = false;

  constructor(private categoryService: CategoryService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.createForm = new FormGroup({
      name: new FormControl('')
    });
  }

  onSubmit(): void {
    const category = this.createForm.value as Category;
    if (category.name !== '') {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        data: 'category'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.categoryService.createOrUpdate(category).subscribe(value => {
            this.dataSource.data = value;
            this.submitted = false;
            this.openSnackBar('Success', 'Oke');
          });
        }
      });
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
