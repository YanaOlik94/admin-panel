import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
  }

  errorHandler(err: any) {
    console.log(err)
  }
}
