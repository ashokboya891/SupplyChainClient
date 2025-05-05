import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/Service/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  passwordVisible = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private account:AccountService,
    private route:Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    // this.isLoginFormSubmitted = true;
  
    if (this.loginForm.valid) {
  
      this.account.postLogin(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log(response);
  
          // this.isLoginFormSubmitted = false;
          this.account.currentUserName = response.email;
  
          localStorage["token"] = response.token;
          localStorage["refreshToken"] = response.refreshToken;
  
          // 🔍 Extract userId from JWT token
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          const userId = tokenPayload.sub;  // or replace 'sub' with your actual claim key for userId if different
          sessionStorage.setItem('userId', userId);
  
          console.log("Logged in User ID:", userId);
  
          this.router.navigate(['/home']);
          this.loginForm.reset();
        },
  
        error: (error: any) => {
          console.log(error);
          // this.showError("Invalid email or password");
        },
  
        complete: () => { },
      });
    // if (this.loginForm.invalid) {
    //   this.markAllAsTouched();
    //   this.account.postLogin(this.loginForm.value).subscribe({
    //     next: (response) => {
    //       this.isLoading = false;
    //       if (response.status === 200) {
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Success',
    //           detail: 'Logged in successfully'
    //         });
    //         this.router.navigate(['/dashboard']);
    //       } else {
    //         this.messageService.add({
    //           severity: 'error',
    //           summary: 'Error',
    //           detail: response.message
    //         });
          
    //       }

    // this.isLoading = true;
    
    // // Simulate API call
    // setTimeout(() => {
    //   this.isLoading = false;
    //   this.messageService.add({
    //     severity: 'success',
    //     summary: 'Success',
    //     detail: 'Logged in successfully'
    //   });
    //   this.router.navigate(['/dashboard']);
    // }, 1500);
  }
}

  private markAllAsTouched() {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}