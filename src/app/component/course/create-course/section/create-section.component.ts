import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course} from '../../../../_model/course';
import {BehaviorSubject, Observable} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Section} from '../../../../_model/section';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {QuizQuestion} from '../../../../_model/quiz-question';
import {SectionService} from '../../../../_service/section.service';
import {DialogComponent} from '../../../base_component/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-section',
  templateUrl: 'create-section.component.html',
  styleUrls: ['create-section.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateSectionComponent implements OnInit {
  displayedColumns: string[] = ['index', 'lessonTitle', 'actions'];
  quizDisplayedColumns: string[] = ['index', 'question', 'actions'];
  sectionForm: FormGroup;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  quizSource = new BehaviorSubject<AbstractControl[]>([]);

  expandedElement: QuizQuestion | null;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private sectionService: SectionService) {
  }

  @Input()
  courseObservable: Observable<Course>;
  @Input()
  course: Course;
  @Input()
  section: Section;

  @Output()
  nextTab: EventEmitter<any> = new EventEmitter();

  submitted = false;

  ngOnInit(): void {
    this.resetFormControl();
  }

  resetFormControl(): void {
    this.sectionForm = this.fb.group({
      id: this.fb.control(''),
      sectionTitle: this.fb.control(''),
      lessons: this.fb.array([]),
      quiz: this.fb.group({
        quizTitle: this.fb.control(''),
        id: this.fb.control(''),
        quizQuestions: this.fb.array([])
      }),
    });
  }

  updateSection(): void {
    this.resetFormControl();
    console.log(this.section);
    if (this.section !== undefined) {
      this.sectionService.getDetail(this.section.id).subscribe(value => {
        console.log(value);
        this.section = value;
        const lessons = this.sectionForm.get('lessons') as FormArray;
        this.section.lessons.forEach(() => lessons.push(this.newLessonFormGroup()));
        const quizQuestions = this.getQuestionFormArray();
        if (this.section.quiz.quizQuestions != null) {
          this.section.quiz.quizQuestions.forEach(question => {
            const quizQuestionForm = this.createNewQuizQuestionForm();
            quizQuestions.push(quizQuestionForm);
            this.checkCorrectAnswer(quizQuestionForm, question);
          });
        } else {
          this.section.quiz.quizQuestions = [];
        }
        this.sectionForm.patchValue(this.section);
        this.updateView();
        this.updateQuizView();
      });
    }
  }

  checkCorrectAnswer(quizQuestionForm: FormGroup, question: QuizQuestion): void {
    const quizAnswerFormArray = quizQuestionForm.get('quizAnswers') as FormArray;
    const correctAnswerFormControl = quizAnswerFormArray.controls[question.correctAnswerPosition].get('active');
    correctAnswerFormControl.patchValue(true);
  }

  deleteQuizQuestion(element: any, index: number): void {
    const quizQuestion = element.value;
    if (quizQuestion.id !== '') {
      console.log('delete in server');
    } else {
      console.log('delete in html');
    }
    this.getQuestionFormArray().removeAt(index);
    this.updateQuizView();
  }

  onClickEditLesson(index: number): void {
    console.log(this.section);
    this.nextTab.emit(this.section.lessons[index]);
  }

  onSubmit(): void {
    console.log(this.sectionForm.value);
    const section = this.sectionForm.value;
    section.course = this.course;
    this.insertOrUpdateLesson(section);
  }

  private insertOrUpdateLesson(section: Section): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: 'section'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.sectionService.insertOrUpdate(section).subscribe(value => {
          console.log(value);
          this.sectionForm.patchValue(value);
          this.section = value;
        });
      }
    });
  }

  onClickAddNewLesson(): void {
    const lessonsFormArray = this.sectionForm.get('lessons') as FormArray;
    lessonsFormArray.push(this.newLessonFormGroup());
    this.updateView();
  }

  onCheckCorrectAnswer(questionIndex: number, answerIndex: number): void {
    console.log(questionIndex + ' ' + answerIndex);
    const questionFormArray = this.getQuestionFormArray();
    const currentQuestionForm = questionFormArray.controls[questionIndex];
    const answersFormArray = this.getFormArrayAnswer(questionIndex);
    for (let i = 0; i < 4; i++) {
      const answerForm = answersFormArray.controls[i] as FormControl;
      const activeForm = answerForm.get('active');
      if (i !== answerIndex) {
        activeForm.patchValue(false);
      } else {
        currentQuestionForm.get('correctQuestionPosition').patchValue(i);
        activeForm.patchValue(true);
      }
    }
    console.log(this.sectionForm.value);
  }

  public newLessonFormGroup(): FormGroup {
    return this.fb.group({
      id: this.fb.control(''),
      lessonTitle: this.fb.control('')
    });
  }

  public createNewQuizQuestionForm(): FormGroup {
    return this.fb.group({
      id: this.fb.control(''),
      questionTitle: this.fb.control(''),
      question: this.fb.control(''),
      correctQuestionPosition: this.fb.control(''),
      quizAnswers: this.fb.array([
        this.createNewAnswerForm(),
        this.createNewAnswerForm(),
        this.createNewAnswerForm(),
        this.createNewAnswerForm()
      ])
    });
  }

  createNewAnswerForm(): FormGroup {
    return this.fb.group({
      id: this.fb.control(''),
      content: this.fb.control(''),
      active: this.fb.control('')
    });
  }

  onClickAddNewQuestion(): void {
    const control = this.getQuestionFormArray();
    control.push(this.createNewQuizQuestionForm());
    this.updateQuizView();
  }

  updateView(): void {
    this.dataSource.next((this.sectionForm.get('lessons') as FormArray).controls);
  }

  updateQuizView(): void {
    this.quizSource.next((this.getQuestionFormArray()).controls);
  }

  getQuestionFormArray(): FormArray {
    return this.sectionForm.get('quiz').get('quizQuestions') as FormArray;
  }

  getFormArrayAnswer(questionIndex: number): FormArray {
    const questionFormArray = this.getQuestionFormArray();
    return questionFormArray.controls[questionIndex].get('quizAnswers') as FormArray;
  }

}
