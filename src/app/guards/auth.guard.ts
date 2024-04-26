import {HttpService} from "../services/http.service";
import {Router} from "@angular/router";
import {inject} from "@angular/core";

export const AuthGuard = () =>  {
  const authService = inject(HttpService);
  const router = inject(Router);

  if (authService.isLoggedIn.getValue()) {
    return true;
  } else {

    return router.parseUrl('/login');
  }
}
