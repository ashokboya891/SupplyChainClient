import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/_guards/Auth';
import { AccountService } from 'src/app/Service/account.service';
import { NotificationService } from 'src/app/Service/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 title = "Nestles Wendor Shoppy";
  greetingMessage: string = '';
  marketStatus: string = '';
  constructor(public accountService: AccountService, private router: Router,private notification:NotificationService,private authService:AuthService) { 
    const savedLang = localStorage.getItem('lang') || 'en';
    // this.translate.setDefaultLang(savedLang);
    // this.translate.use(savedLang);
  }
  switchLanguage(lang: string) {
    // this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
  
  
  ngOnInit() {
    this.updateGreeting();
    this.checkMarketStatus();
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('email');
  }
  showCartDropdown = false;

toggleCartDropdown() {
  this.showCartDropdown = !this.showCartDropdown;
}

closeDropdowns() {
  this.showCartDropdown = false;
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
        this.marketStatus = 'Weekend sale Started..!';
      } else {
        this.marketStatus = ' Heavy discounts on all products';
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
