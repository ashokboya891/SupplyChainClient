import { Component } from '@angular/core';
import { AccountService } from './Service/account.service';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationService } from './Service/notification.service';
import { AuthService } from './_guards/Auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scClient';

  greetingMessage: string = '';
  marketStatus: string = '';
  constructor( public accountService: AccountService, private router: Router,
    private notification:NotificationService,private authService:AuthService) { 
  
  }
  ngOnInit() {
    this.updateGreeting();
    this.checkMarketStatus();
    // Log navigation events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const userName = this.accountService.currentUserName || 'anonymous';

        // let userName = (this.loginService.currentUserName) ? this.loginService.currentUserName : "anonymous";
        let logMsg = new Date().toLocaleString() + ": " + userName + " navigates to " + event.url;
        // this.routerLoggerService.log(logMsg).subscribe();
        
        console.log(
          `${new Date().toLocaleString()}: ${userName} navigates to ${event.url}`
        );
      }
      
    });
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('email');
  }

  getUserName(): string | null {
    return localStorage.getItem('email');
  }
    // Function to update greeting based on IST
    private updateGreeting() {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      const istTime = new Date(now.getTime() + istOffset);
      const hours = istTime.getUTCHours();
  
      if (hours >= 5 && hours < 12) {
        this.greetingMessage = 'Good Morning';
      } else if (hours >= 12 && hours < 17) {
        this.greetingMessage = 'Good Afternoon';
      } else {
        this.greetingMessage = 'Good Evening';
      }
    }
  
    // Function to check if the stock market is open
    private checkMarketStatus() {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istTime = new Date(now.getTime() + istOffset);
      const day = istTime.getUTCDay(); // 0 = Sunday, 6 = Saturday
  
      if (day === 0 || day === 6) {
        this.marketStatus = 'Stock Market Closed (Crypto Trading Only)';
      } else {
        this.marketStatus = 'Stock Market Open';
      }
    }
  onLogOutClicked() {
    this.accountService.getLogout().subscribe({
      next: (response: string) => {
        this.accountService.currentUserName = null;
        localStorage.removeItem("email");
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
         
          
        this.router.navigate([ '/login' ]);
        window.location.reload();

      },
      error: (error) => {
        console.log(error);
      },

      complete: () => { },
    });
  }
  refreshClicked(): void {
    this.accountService.postGenerateNewToken().subscribe({
      next: (response: any) => {
        localStorage["token"] = response.token;
        localStorage["refreshToken"] = response.refreshToken;
        // this.loadCities();
        this.notification.showInfo("refreshed...!")
      },
      error: (error: any) => {
        console.log(error);
        this.notification.showError("Token refresh failed");  
      }
    });
  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    var res= this.authService.isAdmin();
    // console.log("auth service resp"+res)
    return this.authService.isAdmin();
  }
  isUser()
  {
    //var res= this.authService.isUser();
    // console.log("auth service resp"+res)
    return this.authService.isUser(); 
  }

  redirectToLogin(event: Event) {
    if (!this.isLoggedIn()) {
      event.preventDefault();
      this.router.navigate(['/login']);
    }
  }
}
