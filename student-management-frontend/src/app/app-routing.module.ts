import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsComponent } from './students/students.component';
import { StudentsGridComponent } from './students/students-grid.component';
import { StudentEditComponent } from './students/student-edit.component';
import { StudentEditReactiveComponent } from './students/student-edit-reactive.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/students' },
  { path: 'students', component: StudentsComponent},
  { path: 'students/:id', component: StudentEditComponent},
  //{ path: 'students/:id', component: StudentEditReactiveComponent },
  { path: '**', redirectTo: '/students' } //catch any unfound routes and redirect to home page
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  static components = [ StudentsComponent, StudentEditComponent, StudentEditReactiveComponent, StudentsGridComponent ];
}
