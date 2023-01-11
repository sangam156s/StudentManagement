import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataService } from '../core/data.service';
import { IStudent, IState } from '../shared/interfaces';
import { ValidationService } from '../shared/validation.service';

@Component({
  selector: 'app-student-edit-reactive',
  templateUrl: './student-edit-reactive.component.html'
})
export class StudentEditReactiveComponent implements OnInit {

  studentForm: FormGroup;
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
              private dataService: DataService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    if (id !== '0') {
      this.operationText = 'Update';
      this.getStudent(id);
    }

    this.getStates();
    this.buildForm();
  }

  getStudent(id: string) {
      this.dataService.getStudent(id)
        .subscribe((student: IStudent) => {
          this.student = student;
          this.buildForm();
        },
        (err) => console.log(err));
  }

  buildForm() {
      this.studentForm = this.formBuilder.group({
        firstName:  [this.student.firstName, Validators.required],
        lastName:   [this.student.lastName, Validators.required],
        gender:     [this.student.gender, Validators.required],
        email:      [this.student.email, [Validators.required, ValidationService.emailValidator]],
        address:    [this.student.address, Validators.required],
        city:       [this.student.city, Validators.required],
        stateId:    [this.student.stateId, Validators.required]
      });
  }

  getStates() {
    this.dataService.getStates().subscribe((states: IState[]) => this.states = states);
  }
  
  submit({ value, valid }: { value: IStudent, valid: boolean }) {
      
      value._id = this.student._id;
      value.zip = this.student.zip || 0; 
      // var student: IStudent = {
      //   _id: this.student._id,
      // };

      if (value._id) {

        this.dataService.updateStudent(value)
          .subscribe((student: IStudent) => {
            if (student) {
              this.router.navigate(['/students']);
            }
            else {
              this.errorMessage = 'Unable to save student';
            }
          },
          (err) => console.log(err));

      } else {

        this.dataService.insertStudent(value)
          .subscribe((student: IStudent) => {
            if (student) {
              this.router.navigate(['/students']);
            }
            else {
              this.errorMessage = 'Unable to add student';
            }
          },
          (err) => console.log(err));
          
      }
  }
  
  cancel(event: Event) {
    event.preventDefault();
    this.router.navigate(['/students']);
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