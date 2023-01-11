import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataFilterService } from '../core/data-filter.service';
import { DataService } from '../core/data.service';
import { IStudent, IOrder, IPagedResults } from '../shared/interfaces';

@Component({ 
  selector: 'app-students', 
  templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {

  title: string;
  students: IStudent[] = [];
  filteredStudents: IStudent[] = [];

  totalRecords: number = 0;
  pageSize: number = 10;

  constructor(private router: Router, 
              private dataService: DataService,
              private dataFilter: DataFilterService) { }
  
  ngOnInit() {
    this.title = 'Students';
    this.getStudentsPage(1);
  }

  filterChanged(filterText: string) {
    if (filterText && this.students) {
        let props = ['firstName', 'lastName', 'address', 'city', 'state.name', 'orderTotal'];
        this.filteredStudents = this.dataFilter.filter(this.students, props, filterText);
    }
    else {
      this.filteredStudents = this.students;
    }
  }

  pageChanged(page: number) {
    this.getStudentsPage(page);
  }

  getStudentsPage(page: number) {
    this.dataService.getStudentsPage((page - 1) * this.pageSize, this.pageSize)
        .subscribe((response: IPagedResults<IStudent[]>) => {
          this.students = this.filteredStudents = response.results;
          this.totalRecords = response.totalRecords;
        },
        (err: any) => console.log(err),
        () => console.log('getStudentsPage() retrieved students'));
  }

}