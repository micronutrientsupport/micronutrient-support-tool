import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { event } from 'cypress/types/jquery';
import { Subject } from 'rxjs';

@Injectable()
export class QuickMapsService {
  // private sideNavClose = new Subject();
  // public sideNavClose$ = this.sideNavClose.asObservable();

  // private sidenav: MatSidenav;
  public slim = false;

  private slimSubject = new Subject<boolean>();
  public slimObservable = this.slimSubject.asObservable();

  constructor() {}

  sideNavToggle(): void {
    this.sideNavToggleObs((this.slim = !this.slim));
  }

  public sideNavToggleObs(slim: boolean): void {
    this.slimSubject.next(slim);
  }

  // public setSidenav(sidenav: MatSidenav): void {
  //   this.sidenav = sidenav;
  // }

  // closeSideNav(closeSideNav: MouseEvent): void {
  //   this.sideNavClose.next(closeSideNav);
  // }

  // public closeSideNav() {
  //   return this.sidenav.close();
  // }
}
