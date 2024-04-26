import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../services/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private http: HttpService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  isValid(controlName: string): boolean {
    return this.form.get(controlName)!.dirty && !this.form.get(controlName)?.valid;
  }

  submitLogin() {
    if (this.form.value.email === 'user@deepersignals.com' && this.form.value.password === 'password') {
      this.http.login(this.form.value.email.trim(), this.form.value.password.trim()).subscribe((res) => {
        this.http.userRole.next(res);
        this.http.isUserLoggedIn.next(true);
        this.http.isLoggedIn.next(true);
        this.router.navigate(['/dashboard']);
      })
    } else if(this.form.value.email === 'admin@deepersignals.com' && this.form.value.password === 'password') {
      this.http.login(this.form.value.email.trim(), this.form.value.password.trim()).subscribe((res) => {
        this.http.isLoggedIn.next(true);
        this.http.userRole.next(res);
        this.http.isAdminLoggedIn.next(true);
        this.router.navigate(['/dashboard']);
      })
    } else  this.http.isLoggedIn.next(false);
  }

}
