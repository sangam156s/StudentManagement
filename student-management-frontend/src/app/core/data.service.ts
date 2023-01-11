import { Injectable } from '@angular/core';

//Using the new HttpClientModule now. If you're still on < Angular 4.3 see the 
//data.service.ts file instead (simplify rename it to the name 
//of this file to use it instead)
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IStudent, IOrder, IState, IPagedResults, IStudentResponse } from '../shared/interfaces';

@Injectable()
export class DataService {
  
    baseUrl: string = '/api/students';
    baseStatesUrl: string = '/api/states'

    constructor(private http: HttpClient) { 

    }
    
    getStudents() : Observable<IStudent[]> {
        return this.http.get<IStudent[]>(this.baseUrl)
            .pipe(
                   map((students: IStudent[]) => {
                       this.calculateStudentsOrderTotal(students);
                       return students;
                   }),
                   catchError(this.handleError)
                );
    }

    getStudentsPage(page: number, pageSize: number) : Observable<IPagedResults<IStudent[]>> {
        return this.http.get<IStudent[]>(`${this.baseUrl}/page/${page}/${pageSize}`, { observe: 'response' })
            .pipe(
                    map((res) => {
                        //Need to observe response in order to get to this header (see {observe: 'response'} above)
                        const totalRecords = +res.headers.get('x-inlinecount');
                        let students = res.body as IStudent[];
                        this.calculateStudentsOrderTotal(students);
                        return {
                            results: students,
                            totalRecords: totalRecords
                        };
                    }),
                    catchError(this.handleError)
                );
    }
    
    getStudent(id: string) : Observable<IStudent> {
        return this.http.get<IStudent>(this.baseUrl + '/' + id)
            .pipe(
                catchError(this.handleError)
            );
    }

    insertStudent(student: IStudent) : Observable<IStudent> {
        return this.http.post<IStudentResponse>(this.baseUrl, student)
            .pipe(
                   map((data) => {
                       console.log('insertStudent status: ' + data.status);
                       return data.student;
                   }),
                   catchError(this.handleError)
                );
    }
   
    updateStudent(student: IStudent) : Observable<IStudent> {
        return this.http.put<IStudentResponse>(this.baseUrl + '/' + student._id, student) 
            .pipe(
                   map((data) => {
                       console.log('updateStudent status: ' + data.status);
                       return data.student;
                   }),
                   catchError(this.handleError)
                );
    }

    deleteStudent(id: string) : Observable<boolean> {
        return this.http.delete<boolean>(this.baseUrl + '/' + id)
            .pipe(
                catchError(this.handleError)
            );
    }
   
    getStates(): Observable<IState[]> {
        return this.http.get<IState[]>(this.baseStatesUrl)
            .pipe(
                catchError(this.handleError)
            );
    }

    calculateStudentsOrderTotal(students: IStudent[]) {
        for (let student of students) {
            if (student && student.orders) {
                let total = 0;
                for (let order of student.orders) {
                    total += (order.price * order.quantity);
                }
                student.orderTotal = total;
            }
        }
    }
    
    private handleError(error: HttpErrorResponse) {
        console.error('server error:', error); 
        if (error.error instanceof Error) {
          let errMessage = error.error.message;
          return throwError(() => new Error(errMessage));
          // Use the following instead if using lite-server
          //return Observable.throw(err.text() || 'backend server error');
        }
        return throwError(() => new Error(error.message || 'Node.js server error'));
    }

}
