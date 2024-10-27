import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { adminList } from '../../constants/sidenav-menu-item-list-admin';
import { userlist } from '../../constants/sidenav-menu-item-list-user';
import { LoaderOverlayService } from '../../services/loader-overlay.service';
import { MatNavList } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-leftmenu',
  standalone: true,
  imports: [
    MatNavList,
    CommonModule,
    FormsModule
  ],
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.scss']
})
export class LeftmenuComponent implements OnInit {
  footerZIndex!: number;
  isAdmin = false;
  sideBarItems: any[] = [];
  currentUser: any = {};

  constructor(
    private router: Router, 
    private loader: LoaderOverlayService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.sideBarItems = this.isAdmin ? adminList : userlist;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');

      this.sideBarItems.forEach((item: any) => item.expanded = false);

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const url = this.router.url;
        if (url === '/' || url === '/project-onboarding/cf') {
          this.router.navigateByUrl(url, { skipLocationChange: true });
        }
      });
    }
  }

  isActive(route: any): boolean {
    return this.router.isActive(route, true);
  }

  toggleItem(item: any) {
    item.expanded = !item.expanded;
  }

  logOut() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAdmin');  
      this.router.navigate(['/login']).then(() => {});
    }
  }
  routeTo(route: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate([route]);
    }
  }
}
