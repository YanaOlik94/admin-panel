import {Component, Input} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() isLoggedIn!: boolean;
  isAdminLoggedIn!: boolean;
  isUserLoggedIn!: boolean;

  constructor(private http: HttpService,
              private router: Router) {

    this.http.isLoggedIn.subscribe((newValue: boolean) => {
      this.isLoggedIn = newValue;
      console.log('isLoggedIn', newValue)
    });

    this.http.isAdminLoggedIn.subscribe((newValue: boolean) => {
      this.isAdminLoggedIn = newValue;
      console.log('isAdminLoggedIn', newValue)
    });

    this.http.isUserLoggedIn.subscribe((newValue: boolean) => {
      this.isUserLoggedIn = newValue;
      console.log('isUserLoggedIn', newValue)
    });
  }

  logout() {
    this.http.logout();
    this.router.navigate(['/login']);
  }
}
