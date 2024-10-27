import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet, RouterLinkActive, Router,NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { adminList } from '../../constants/sidenav-menu-item-list-admin';
import { userlist } from '../../constants/sidenav-menu-item-list-user';
import { filter } from 'rxjs/operators';
import { LoaderOverlayService } from '../../services/loader-overlay.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterLink,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    RouterOutlet,
    RouterLinkActive,
    CommonModule,
    MatExpansionModule,
    MatMenuModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', overflow: 'hidden' })),
      state('expanded', style({ height: '*', overflow: 'visible' })),
      transition('collapsed <=> expanded', animate('200ms ease-out')),
    ]),
  ],
})

export class SidenavComponent implements OnInit {
  constructor(
    private router: Router, 
    private loader:LoaderOverlayService,
  ) { }
  footerZIndex!:number;
  isAdmin = localStorage.getItem('isAdmin') === 'true'? true:false;
  sideBarItems = this.isAdmin ? adminList : userlist;
  currentUser:any = JSON.parse(localStorage.getItem('currentUser')?? '{}');
  ngOnInit(){
    console.log(this.isAdmin)
    this.sideBarItems.forEach((item: any) => item.expanded = false);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      if (url === '/' || url === '/project-onboarding/cf') {
        this.router.navigateByUrl(url, { skipLocationChange: true })
      }
    });
  }
  
  isActive(route: any): boolean {
    return this.router.isActive(route, true);
  }
  toggleItem(item:any){
    item.expanded = !item.expanded;
  }  
  logOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');  
    this.router.navigate(['/login']).then(() => {
    });
  }
}