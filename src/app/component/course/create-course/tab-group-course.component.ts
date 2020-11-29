import {Component, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../../_model/course';
import {Section} from '../../../_model/section';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../_service/course.service';
import {Observable} from 'rxjs';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {CreateSectionComponent} from './section/create-section.component';
import {CreateLessonComponent} from './lesson/create-lesson.component';
import {Lesson} from '../../../_model/lesson';
import {SectionService} from '../../../_service/section.service';

@Component({
  selector: 'app-tab-groups-course',
  templateUrl: 'tab-group-course.component.html',
  styleUrls: ['tab-group-course.component.css']
})
export class TabGroupCourseComponent implements OnInit {
  selectedIndex = 0;
  id: number;
  section: Section;
  courseObservable: Observable<Course>;
  lesson: Lesson;
  disable = true;
  @ViewChild(CreateSectionComponent) private createSectionComponent: CreateSectionComponent;
  @ViewChild(CreateLessonComponent) private createLessonComponent: CreateLessonComponent;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private sectionService: SectionService) {
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedIndex = event.index;
    if (event.index === 1) {
      this.createSectionComponent.updateSection();
    } else if (event.index === 2) {
      this.createLessonComponent.updateLesson();
    }
  }

  changeTabSection(section: Section): void {
    if (section !== undefined) {
      this.sectionService.getDetail(section.id).subscribe(value => {
        this.section = value;
        this.selectedIndex = 1;
      });
    }
  }

  changeTabLesson(lesson: Lesson): void {
    console.log(lesson);
    if (lesson !== undefined) {
      this.disable = false;
      this.lesson = lesson;
      this.selectedIndex = 2;
    }
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id !== undefined) {
      this.courseObservable = this.courseService.getCourseDetail(this.id);
    }
  }
}
