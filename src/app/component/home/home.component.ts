import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {FormControl, FormGroup} from '@angular/forms';
import {CourseService} from '../../_service/course.service';
import {Course} from '../../_model/course';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<Course>();
  searchForm: FormGroup;
  submitted = false;
  pageSize = 5;
  statues: string[] = [
    'Waiting', 'Approved'
  ];

  constructor(private courseService: CourseService, private router: Router) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public onPage(event: PageEvent): void {
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      courseName: new FormControl(''),
      instructor: new FormControl(''),
      createFrom: new FormControl(''),
      createTo: new FormControl(''),
      status: new FormControl(''),
      numberStudent: new FormControl(''),
    });
    this.onSubmit();
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
    this.submitted = true;
    this.courseService.searchCourse().subscribe(value => {
      this.dataSource.data = value;
      this.submitted = false;
    });
  }
}
