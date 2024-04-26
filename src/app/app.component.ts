import {AfterContentChecked, Component} from '@angular/core';
import {HttpService} from "./services/http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterContentChecked{
  title = 'admin-panel';
  isLogged!: boolean;

  constructor(private http: HttpService) {
  }

  ngAfterContentChecked(): void {
    this.http.isLoggedIn.subscribe(state => {
      this.isLogged = state;
    });
  }

}
