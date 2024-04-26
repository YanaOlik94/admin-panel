import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.stage";
import {UserRole} from "../classes/user-role";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAdminLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public userRole: BehaviorSubject<UserRole>;

  constructor(private http: HttpClient) {
    this.userRole = new BehaviorSubject<UserRole>(new UserRole());
    console.log(this.userRole )
  }


  login(email: string, pass: string): Observable<any> {

    return this.http.post(`${environment.url}/api/login`, {
      email: email, password: pass
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .pipe(map((res: any) => res, (err: any) => err));
  }

  getReport(token: string): Observable<any> {

    return this.http.get(`${environment.url}/api/userassessments`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Token': `${token}`
      }
    })
      .pipe(
        map((res: any) => res))
  }

  getGraphData(token: string, id: number): Observable<any> {
    const header: HttpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Token', `${token}`);

    const params = {
      id: id
    };

    return this.http.get(`${environment.url}/api/userassessments/graph`, {
    headers: header, params
    })
      .pipe(
        map((res: any) => res.data))
  }

  getUsers(token: string) {

    return this.http.get(`${environment.url}/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Token': `${token}`
      }
    })
      .pipe(
        map((res: any) => res))
  }

  logout() {
    this.isLoggedIn.next(false);
    this.isAdminLoggedIn.next(false);
    this.isUserLoggedIn.next(false);
  }

}
