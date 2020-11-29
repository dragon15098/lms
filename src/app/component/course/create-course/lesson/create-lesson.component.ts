import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Lesson} from '../../../../_model/lesson';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {LessonQuestion} from '../../../../_model/lesson-question';
import {BehaviorSubject, Observable} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LessonService} from '../../../../_service/lesson.service';

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
  public Editor = ClassicEditor;
  lessonForm: FormGroup;
  @Input()
  lesson: Lesson;

  @Input()
  lessonObservable: Observable<Lesson>;

  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayColumn: string[] = ['index', 'question', 'actions'];
  submitted: false;

  expandedElement: LessonQuestion;

  constructor(private fb: FormBuilder,
              private lessonService: LessonService) {
  }

  ngOnInit(): void {
    this.resetFormControl();
  }

  updateLesson(): void {
    this.resetFormControl();
    if (this.lesson !== undefined) {
      this.lessonService.getDetail(this.lesson.id).subscribe(value => {
        console.log(value);
        this.lesson = value;
        const questionFormArray = this.lessonForm.get('lessonQuestions') as FormArray;
        value.lessonQuestions.forEach(question => questionFormArray.push(this.createNewLessonQuestionForm()));
        this.lessonForm.patchValue(this.lesson);
        this.updateView();
        console.log(this.lessonForm);
      });
    }
  }

  onSubmit(): void {
    console.log(this.lessonForm);
    console.log(this.lessonForm.value);
  }

  onCheck(indexQuestion: number, answerIndex: number): void {
    console.log(indexQuestion + ' ' + answerIndex);
    const questions = this.lessonForm.get('lessonQuestions') as FormArray;
    const answers = questions.controls[indexQuestion].get('lessonAnswers') as FormArray;
    for (let i = 0; i < 4; i++) {
      if (i !== answerIndex) {
        const answer = answers.controls[i] as FormControl;
        answer.get('active').patchValue(false);
      } else {
        const answer = answers.controls[i] as FormControl;
        answer.get('active').patchValue(true);
      }
    }
    console.log(this.lessonForm.value);
  }

  resetFormControl(): void {
    this.lessonForm = this.fb.group({
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
    console.log(this.lessonForm);
  }


  createNewLessonQuestionForm(): FormGroup {
    return this.fb.group({
      id: this.fb.control(''),
      questionTitle: this.fb.control(''),
      question: this.fb.control(''),
      lessonAnswers: this.fb.array([
        this.fb.group({
          id: this.fb.control(''),
          explanation: this.fb.control(''),
          content: this.fb.control(''),
          active: this.fb.control('')
        }),
        this.fb.group({
          id: this.fb.control(''),
          explanation: this.fb.control(''),
          content: this.fb.control(''),
          active: this.fb.control('')
        }),
        this.fb.group({
          id: this.fb.control(''),
          explanation: this.fb.control(''),
          content: this.fb.control(''),
          active: this.fb.control('')
        }),
        this.fb.group({
          id: this.fb.control(''),
          explanation: this.fb.control(''),
          content: this.fb.control(''),
          active: this.fb.control('')
        })
      ])
    });
  }

  deleteQuizQuestion(element: any, index: number): void {

  }

  onFileComplete(data: string): void {
    console.log(data);
    this.lessonForm.get('urlVideo').setValue(data);
  }

  updateView(): void {
    this.dataSource.next((this.lessonForm.get('lessonQuestions') as FormArray).controls);
  }

}
