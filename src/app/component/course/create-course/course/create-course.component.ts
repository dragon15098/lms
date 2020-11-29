import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CourseService} from '../../../../_service/course.service';
import {Router} from '@angular/router';
import {CategoryService} from '../../../../_service/category.service';
import {Category} from '../../../../_model/category';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../../../base_component/dialog/dialog.component';
import {Course} from '../../../../_model/course';
import {User} from '../../../../_model/user';
import {UseService} from '../../../../_service/use.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SectionService} from '../../../../_service/section.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'sectionTitle', 'actions'];
  submitted = false;
  createFormGroup: FormGroup;
  categories: Category[] = [];
  instructors: User[] = [];

  selectedCriteria: User;

  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  @Input()
  courseObservable: Observable<Course>;

  @Output()
  nextTab: EventEmitter<any> = new EventEmitter();

  course: Course;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private userService: UseService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sectionService: SectionService) {
  }

  ngOnInit(): void {
    this.createFormGroup = this.fb.group({
      id: this.fb.control(''),
      title: this.fb.control(''),
      category: this.fb.control(''),
      instructor: this.fb.control(''),
      description: this.fb.control(''),
      sections: this.fb.array([])
    });

    this.categoryService.getAll().subscribe(value => {
      this.categories = value;
    });

    this.userService.getAllInstructor().subscribe(value => {
      this.instructors = value;
    });
    this.observerCourse();
  }

  private observerCourse(): void {
    if (this.courseObservable !== null) {
      this.courseObservable.subscribe(value => {
        value.sections = [];
        this.createFormGroup.patchValue(value);
        this.selectedCriteria = value.instructor;
        this.course = value;
        if (value.id != null) {
          this.sectionService.getAllSectionByCourse(value).subscribe(value1 => {
            const sections = this.createFormGroup.get('sections') as FormArray;
            value1.forEach(() => sections.push(this.createNewFormGroup()));
            sections.patchValue(value1);
            this.course.sections = value1;
            this.updateView();
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

  public onClickAddNewSection(): void {
    const control = this.createFormGroup.get('sections') as FormArray;
    control.push(this.createNewFormGroup());
    this.updateView();
  }

  public createNewFormGroup(): FormGroup {
    return this.fb.group({
      sectionTitle: this.fb.control(''),
      id: this.fb.control('')
    });
  }

  public onClickLesson(index: number): void {
    this.nextTab.emit(this.course.sections[index]);
  }

  validCourse(course: Course): boolean {
    if (course.title === '') {
      return false;
    }
    const emptySection = course.sections.find(section => section.sectionTitle === '');
    return !emptySection;
  }

  public onSubmit(): void {
    const course: Course = this.createFormGroup.value;
    if (course.id !== null) {
      this.updateCourse(course);
    } else {
      this.createCourse(course);
    }
  }

  private createCourse(course: Course): void {
    if (this.validCourse(course)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        data: 'course'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.createNewCourse(course);
        }
      });
    }
  }


  private updateCourse(course: Course): void {
    if (this.validCourse(course)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        data: 'course'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.courseService.updateCourse(course).subscribe(value => {
            this.course = value;
            this.openSnackBar('Success', 'Oke');
          });
        }
      });
    }
  }

  private createNewCourse(course: Course): void {
    this.courseService.createCourse(course).subscribe(value => {
      this.course = value;
      this.openSnackBar('Success', 'Oke');
    });
  }

  updateView(): void {
    this.dataSource.next((this.createFormGroup.get('sections') as FormArray).controls);
  }
}
