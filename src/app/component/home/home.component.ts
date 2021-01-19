import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl, FormGroup} from '@angular/forms';
import {CourseService} from '../../_service/course.service';
import {Course, CourseStatus} from '../../_model/course';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryService} from '../../_service/category.service';
import {Category} from '../../_model/category';
import {MatDialog} from '@angular/material/dialog';
import {DialogApproveComponent} from './dialog-approve/dialog-approve.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['position', 'title', 'instructor', 'commentCount', 'price', 'courseSell', 'status', 'actions'];
  dataSource = new MatTableDataSource<Course>();
  searchForm: FormGroup;
  submitted = false;
  statues: string[] = [
    'WAIT', 'APPROVED'
  ];
  categoryFormControl = new FormControl();

  categories: Category[] = [];

  constructor(private courseService: CourseService,
              private snackBar: MatSnackBar,
              private categoryService: CategoryService,
              private router: Router,
              private dialog: MatDialog) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 3);
    this.searchForm = new FormGroup({
      courseName: new FormControl(''),
      instructor: new FormControl(''),
      createFrom: new FormControl(fromDate),
      createTo: new FormControl(new Date()),
      status: new FormControl(''),
      categoryId: this.categoryFormControl
    });
    this.getAllCategory();
    this.onSubmit();
  }

  public getAllCategory(): void {
    this.categoryService.getAll().subscribe(value => {
      this.categories = value;
    });

  }


  get f(): any {
    return this.searchForm.controls;
  }

  public onClickAddNewCourse(): void {
    this.router.navigate(['/create-course']).then(() => {
    });
  }

  public onClickCourseDetail(row: Course): void {
    this.router.navigate([`course/${row.id}`]).then(() => {
    });
  }

  onSubmit(): void {
    const searchValue = this.searchForm.value;
    const courseObservable = this.courseService.searchCourse(
      this.categoryFormControl.value,
      searchValue.courseName,
      this.convert(searchValue.createFrom),
      this.convert(searchValue.createTo),
      searchValue.instructor,
      searchValue.status);
    if (courseObservable != null) {
      this.submitted = true;
      courseObservable.subscribe(value => {
        this.submitted = false;
        this.dataSource.data = value.data;
      }, () => {
        this.submitted = false;
      });
    }
  }

  convert(str): string {
    const date = new Date(str);
    const mnth = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  onClickApprove(i: number): void {
    const course = this.dataSource.data[i] as Course;
    const dialogRef = this.dialog.open(DialogApproveComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(price => {
      if (price !== undefined) {
        course.price = price;
        console.log(price);
        console.log(course);
        this.approveCourse(course);
      }
    });
  }

  approveCourse(course: Course): void {
    this.courseService.approve(course).subscribe(value => {
      if (value.status === CourseStatus.APPROVED) {
        this.openSnackBar('Success', 'Oke');
        this.onSubmit();
      }
    });
  }


  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
