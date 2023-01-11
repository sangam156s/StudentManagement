import { Injectable } from '@angular/core';

import { IStudent } from '../shared/interfaces';

@Injectable()
export class TrackByService {
  
  student(index: number, student: IStudent) {
    return student._id;
  }
  
}