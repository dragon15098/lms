import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './_helpers/auth.guard';
import {NgModule} from '@angular/core';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {CreateCourseComponent} from './component/course/create-course/course/create-course.component';
import {TabGroupCourseComponent} from './component/course/create-course/tab-group-course.component';
import {CategoryComponent} from './component/category/category.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'categories', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'create-course', component: TabGroupCourseComponent, canActivate: [AuthGuard]},
  {path: 'course/:id', component: TabGroupCourseComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'login'},
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
