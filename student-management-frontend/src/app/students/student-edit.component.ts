import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../core/data.service';
import { IStudent, IState } from '../shared/interfaces';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html'
})
export class StudentEditComponent implements OnInit {

  student: IStudent = {
    firstName: '',
    lastName: '',
    gender: '',
    address: '',
    email: '',
    city: '',
    zip: 0
  };
  states: IState[];
  errorMessage: string;
  deleteMessageEnabled: boolean;
  operationText: string = 'Insert';
  
  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private dataService: DataService) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    if (id !== '0') {
      this.operationText = 'Update';
      this.getStudent(id);
    }

    this.getStates();
  }

  getStudent(id: string) {
      this.dataService.getStudent(id)
        .subscribe((student: IStudent) => {
          this.student = student;
        },
        (err: any) => console.log(err));
  }

  getStates() {
    this.dataService.getStates().subscribe((states: IState[]) => this.states = states);
  }
  
  submit() {

      if (this.student._id) {

        this.dataService.updateStudent(this.student)
          .subscribe((student: IStudent) => {
            if (student) {
              this.router.navigate(['/students']);
            } else {
              this.errorMessage = 'Unable to save student';
            }
          },
          (err: any) => console.log(err));

      } else {

        this.dataService.insertStudent(this.student)
          .subscribe((student: IStudent) => {
            if (student) {
              this.router.navigate(['/students']);
            }
            else {
              this.errorMessage = 'Unable to add student';
            }
          },
          (err: any) => console.log(err));
          
      }
  }
  
  cancel(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }

  delete(event: Event) {
    event.preventDefault();
    this.dataService.deleteStudent(this.student._id)
        .subscribe((status: boolean) => {
          if (status) {
            this.router.navigate(['/students']);
          }
          else {
            this.errorMessage = 'Unable to delete student';
          }
        },
        (err) => console.log(err));
  }

}