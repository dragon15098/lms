import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app.routing';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {CreateCourseComponent} from './component/course/create-course/course/create-course.component';
import {DialogComponent} from './component/base_component/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TabGroupCourseComponent} from './component/course/create-course/tab-group-course.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {CreateSectionComponent} from './component/course/create-course/section/create-section.component';
import {CreateLessonComponent} from './component/course/create-course/lesson/create-lesson.component';
import {CategoryComponent} from './component/category/category.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {FileUploadComponent} from './component/base_component/file-upload/file-upload.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CreateCategoryComponent} from './component/category/create/create-category.component';
import {CreateUserComponent} from './component/user/create-user/create-user.component';
import {UserComponent} from './component/user/user.component';
import {DialogApproveComponent} from './component/home/dialog-approve/dialog-approve.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CreateCourseComponent,
    DialogComponent,
    TabGroupCourseComponent,
    CreateSectionComponent,
    CreateLessonComponent,
    CategoryComponent,
    FileUploadComponent,
    CreateCategoryComponent,
    CreateUserComponent,
    UserComponent,
    DialogApproveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    CKEditorModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
