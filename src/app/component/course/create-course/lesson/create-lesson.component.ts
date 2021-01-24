import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../../../../_model/lesson';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {LessonQuestion} from '../../../../_model/lesson-question';
import {BehaviorSubject, Observable} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LessonService} from '../../../../_service/lesson.service';
import {DialogComponent} from '../../../base_component/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Section} from '../../../../_model/section';
import {LessonQuestionService} from '../../../../_service/lesson-question.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateLessonComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private lessonService: LessonService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private cdf: ChangeDetectorRef,
              private lessonQuestionService: LessonQuestionService) {
  }

  public Editor = ClassicEditor;
  lessonForm: FormGroup;
  @Input()
  lesson: Lesson;

  @Input()
  section: Section;

  @Input()
  lessonObservable: Observable<Lesson>;

  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayColumn: string[] = ['index', 'question', 'actions'];
  submitted: false;

  expandedElement: LessonQuestion;

  private static setCorrectAnswer(questionForm: FormGroup, question: LessonQuestion): void {
    const answerFormArray = questionForm.get('lessonAnswers') as FormArray;
    answerFormArray.controls[question.correctQuestionPosition].get('active').patchValue(true);
  }

  ngOnInit(): void {
    this.resetFormControl();
  }

  updateLessonValue(): void {
    this.resetFormControl();
    if (this.lesson !== undefined) {
      this.lessonService.getDetail(this.lesson.id).subscribe(lessonResponse => {
        this.lesson = lessonResponse;
        lessonResponse.lessonQuestions.forEach(question => {
          this.setAnswerForEachQuestion(question);
        });
        this.lessonForm.patchValue(this.lesson);
        this.updateView();
        this.cdf.detectChanges();
      });
    }
  }

  private setAnswerForEachQuestion(question: LessonQuestion): void {
    const questionFormArray = this.lessonForm.get('lessonQuestions') as FormArray;
    const questionForm = this.createNewLessonQuestionForm();
    questionFormArray.push(questionForm);
    CreateLessonComponent.setCorrectAnswer(questionForm, question);
  }

  onSubmit(): void {
    const lesson = this.lessonForm.value as Lesson;
    lesson.section = this.section;
    this.insertOrUpdateLesson(lesson);
  }

  private insertOrUpdateLesson(lesson: Lesson): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: 'lesson'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.lessonService.insertOrUpdate(lesson).subscribe(value => {
          this.lesson = value;
          this.lessonForm.patchValue(value);
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

  onCheckCorrectAnswer(indexQuestion: number, answerIndex: number): void {
    const questionsFormArray = this.lessonForm.get('lessonQuestions') as FormArray;
    const questionFromGroup = questionsFormArray.controls[indexQuestion];
    const answersFormArray = questionFromGroup.get('lessonAnswers') as FormArray;
    for (let i = 0; i < 4; i++) {
      const answerForm = answersFormArray.controls[i] as FormControl;
      const activeForm = answerForm.get('active');
      if (i !== answerIndex) {
        activeForm.patchValue(false);
      } else {
        questionFromGroup.get('correctQuestionPosition').patchValue(i);
        activeForm.patchValue(true);
      }
    }
  }

  resetFormControl(): void {
    this.lessonForm = this.fb.group({
      id: this.fb.control(''),
      lessonTitle: this.fb.control(''),
      description: this.fb.control(''),
      urlVideo: this.fb.control(''),
      lessonQuestions: this.fb.array([])
    });
  }

  createNewQuestion(): void {
    const lessonQuestions = this.lessonForm.get('lessonQuestions') as FormArray;
    lessonQuestions.push(this.createNewLessonQuestionForm());
    this.updateView();
  }

  createNewLessonQuestionForm(): FormGroup {
    return this.fb.group({
      id: this.fb.control(''),
      questionTitle: this.fb.control(''),
      question: this.fb.control(''),
      correctQuestionPosition: this.fb.control(''),
      lessonAnswers: this.fb.array([
        this.createFormAnswer(),
        this.createFormAnswer(),
        this.createFormAnswer(),
        this.createFormAnswer()])
    });
  }

  private createFormAnswer(): FormGroup {
    return this.fb.group({
      id: this.fb.control(''),
      content: this.fb.control(''),
      active: this.fb.control('')
    });
  }

  deleteLessonQuestion(element: any, index: number): void {
    const lessonQuestion = element.value;
    if (lessonQuestion.id !== '') {
      this.lessonQuestionService.deleteLessonQuestion(lessonQuestion.id).subscribe(() => {
        this.getQuestionFormArray().removeAt(index);
        this.updateView();
      });
    } else {
      this.getQuestionFormArray().removeAt(index);
      this.updateView();
    }
  }

  onFileComplete(data: string): void {
    this.lessonForm.get('urlVideo').setValue(data);
  }

  getQuestionFormArray(): FormArray {
    return this.lessonForm.get('lessonQuestions') as FormArray;
  }

  updateView(): void {
    this.dataSource.next((this.lessonForm.get('lessonQuestions') as FormArray).controls);
  }

}
