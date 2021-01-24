import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_service/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    localStorage.setItem('currentUser', '');
    authenticationService.clear();
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']).then(() => {
      });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.loginForm.controls;
  }

  // @Output() submitEM = new EventEmitter();

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/home']).then(() => {
          });
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
