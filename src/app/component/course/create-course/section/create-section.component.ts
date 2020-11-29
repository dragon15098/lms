import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course} from '../../../../_model/course';
import {BehaviorSubject, Observable} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Section} from '../../../../_model/section';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {QuizQuestion} from '../../../../_model/quiz-question';

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

  constructor(private fb: FormBuilder) {
  }

  @Input()
  course: Observable<Course>;

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
    if (this.section !== undefined) {

      const lessons = this.sectionForm.get('lessons') as FormArray;
      this.section.lessons.forEach(() => lessons.push(this.newLessonFormGroup()));
      // lessons.patchValue(this.section.lessons);

      const quizQuestions = this.getFormArrayQuiz();
      this.section.quiz.quizQuestions.forEach(() => quizQuestions.push(this.createNewQuizQuestionForm()));

      this.sectionForm.patchValue(this.section);
      this.updateView();
      this.updateQuizView();
    }
  }

  deleteQuizQuestion(element: any, index: number): void {
    const quizQuestion = element.value;
    if (quizQuestion.id !== '') {
      console.log('delete in server');
    } else {
      console.log('delete in html');
    }
    this.getFormArrayQuiz().removeAt(index);
    this.updateQuizView();
  }

  onClickEditLesson(index: number): void {
    console.log(this.section);
    this.nextTab.emit(this.section.lessons[index]);
  }

  onSubmit(): void {
    console.log(this.sectionForm.value);
  }

  onCheck(): void {
    console.log(this.sectionForm.value);
  }

  onClickAddNewLesson(): void {
    const lessonsFormArray = this.sectionForm.get('lessons') as FormArray;
    lessonsFormArray.push(this.newLessonFormGroup());
    this.updateView();
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
      quizAnswers: this.fb.array([
        this.fb.group({
          id: this.fb.control(''),
          content: this.fb.control(''),
        }),
        this.fb.group({
          id: this.fb.control(''),
          content: this.fb.control(''),
        }),
        this.fb.group({
          id: this.fb.control(''),
          content: this.fb.control(''),
        }),
        this.fb.group({
          id: this.fb.control(''),
          content: this.fb.control(''),
        }),
      ])
    });
  }

  onClickAddNewQuestion(): void {
    const control = this.getFormArrayQuiz();
    control.push(this.createNewQuizQuestionForm());
    this.updateQuizView();
  }

  updateView(): void {
    this.dataSource.next((this.sectionForm.get('lessons') as FormArray).controls);
  }

  updateQuizView(): void {
    this.quizSource.next((this.getFormArrayQuiz()).controls);
  }

  getFormArrayQuiz(): FormArray {
    return this.sectionForm.get('quiz').get('quizQuestions') as FormArray;
  }

}
