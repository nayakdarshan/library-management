import { Component } from '@angular/core';
import { RouterOutlet,RouterModule, Router, NavigationEnd } from '@angular/router';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LeftmenuComponent } from './shared/components/leftmenu/leftmenu.component';
import { ScreenSizeService } from './shared/services/screen-size.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidenavComponent,
    HttpClientModule,
    LeftmenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[{ provide: LocationStrategy, useClass: HashLocationStrategy },HttpClientModule],
})
export class AppComponent {
  title = 'library-management-app';
  showSideNav = false;
  isMobile = false;

  constructor(private router: Router,private screenSizeService: ScreenSizeService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSideNav = !(event.url === '/' || event.url === '/login' || event.url === '/register') && !event.url.includes('/login' || '/register');
      }
    });
    this.screenSizeService.screenSize$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }
}
