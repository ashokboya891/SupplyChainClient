import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUser } from '../Models/RegisterUser';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LoginUser } from '../Models/Login-user';
import { User } from '../Models/User';
import { NotificationService } from './notification.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const API_BASE_URL: string = "https://localhost:7092/api/Account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public currentUserRole:string|null=null;
  public currentUserName: string | null = null;
  private currentUserSource=new BehaviorSubject<User | null>(null);
  currentUser$=this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient,private jwtHelperService:JwtHelperService,private notificationService:NotificationService) {
    this.loadUserFromStorage();
  }

  public postRegister(registerUser: RegisterUser): Observable<any> {
    return this.httpClient.post<RegisterUser>(`${API_BASE_URL}register`, registerUser);
  }
  public postLogin(loginUser: LoginUser){
    console.log("login user is "+loginUser.email)
    console.log("login password is "+loginUser.password)
    return this.httpClient.post<any>(`${API_BASE_URL}/login`, loginUser, { responseType: 'json' }).pipe(
      map((response) => {
        if (response) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("refreshToken", response.refreshToken);
          localStorage.setItem("email", response.email);
          this.currentUserRole = response.roles[0];
          this.currentUserName = response.userName;
          sessionStorage.setItem('currentUser', JSON.stringify(response));
          this.notificationService.showSuccess("Login Successful");
        }
  
        return response; // ✅ This line is **very important**
      })
    );
  }
  

  public getLogout(): Observable<string> {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    sessionStorage.removeItem("currentUser")
    this.currentUserName = null;
    return this.httpClient.get<string>(`${API_BASE_URL}/logout`);
  }

  public postGenerateNewToken(): Observable<any> {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    return this.httpClient.post<any>(`${API_BASE_URL}generate-new-jwt-token`, { token, refreshToken }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      })
    );
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (token && !this.jwtHelperService.isTokenExpired(token)) {
      const currentUser = sessionStorage.getItem('currentUser');
      if (currentUser) {
        this.currentUserName = JSON.parse(currentUser).email; // Set the current user name
      }
      return true; // Token is valid
    }
    return false; // Token is not valid
  }
  public loadUserFromStorage() {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      this.currentUserName = storedUserName;
    }
  }
}
