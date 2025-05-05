import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('currentUser');  // Check if user exists in session storage
  }

  isAdmin(): boolean {
    const userData = sessionStorage.getItem('currentUser');  
    if (userData) {
      const user = JSON.parse(userData);  
      return user.roles.includes('Admin');  // Check if the user has an "Admin" role
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('user'); // Clear user data on logout
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    sessionStorage.removeItem("currentUser")
  }
  isUser(): boolean {
    const userData = sessionStorage.getItem('currentUser');  
    if (userData) {
      const user = JSON.parse(userData);  
      return user.roles.includes('User') || user.roles.includes('Admin');  
    }
    return false;
  }
  
  login(email: string, password: string) {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }
}
