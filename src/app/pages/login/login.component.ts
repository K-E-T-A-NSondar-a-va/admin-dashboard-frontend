import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from '../../services/http-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  loginForm: FormGroup; 

  constructor(private httpService: HttpServiceService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  submitLoginForm() {
    
    if(this.loginForm.valid) {
      const captchaResponse = (window as any).grecaptcha.getResponse();

      if (!captchaResponse) {
        alert('Please verify you are human');
        return;
      }

      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        captchaResponse: captchaResponse
      };

      this.httpService.login(loginData).subscribe(
        (rs:any) => {
          console.log("response from server", rs);
          localStorage.setItem('token',rs.token)
          localStorage.setItem('username',rs.username);
          this.router.navigate(['/home'])
        },
        (error: any) => {
          alert(error.error.errorMessage);

          if(error.error.errorMessage == "Invalid CAPTCHA") {
            window.location.reload();
          }
          console.log('error: ',error);
        }
      )
    } else {
      alert("please fill all the fields in the form")
    }
  }

}
