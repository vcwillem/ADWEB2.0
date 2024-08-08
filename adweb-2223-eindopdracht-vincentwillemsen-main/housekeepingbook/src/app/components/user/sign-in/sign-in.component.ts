import {Component} from '@angular/core';
import {AuthService} from 'src/app/shared/services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    if (authService.isLoggedIn) {
      this.router.navigate(['home']);
    }
  }

}
