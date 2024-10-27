import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private screenSizeSubject = new BehaviorSubject<boolean>(this.isMobile());
  screenSize$ = this.screenSizeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => {
        this.screenSizeSubject.next(this.isMobile());
      });
    }
  }

  private isMobile(): boolean {
    return isPlatformBrowser(this.platformId) ? window.innerWidth < 600 : false;
  }
}
