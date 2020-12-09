import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './_helpers/auth.guard';
import {NgModule} from '@angular/core';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {CreateCourseComponent} from './component/course/create-course/course/create-course.component';
import {TabGroupCourseComponent} from './component/course/create-course/tab-group-course.component';
import {CategoryComponent} from './component/category/category.component';
import {CreateCategoryComponent} from './component/category/create/create-category.component';
import {UserComponent} from './component/user/user.component';
import {CreateUserComponent} from './component/user/create-user/create-user.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'course', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'categories', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'create-category', component: CreateCategoryComponent, canActivate: [AuthGuard]},
  {path: 'create-course', component: TabGroupCourseComponent, canActivate: [AuthGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'user/:id', component: CreateUserComponent, canActivate: [AuthGuard]},
  {path: 'create-user', component: CreateUserComponent, canActivate: [AuthGuard]},
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
