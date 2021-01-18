import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'micronutrient-support-tool';

  /**
   * To choose which routes do not show a large footer add this array
   */
  public minFooterPages = ['/quick-maps'];

  constructor(public router: Router) {}

  public showMinFooter(url: string): boolean {
    if (this.minFooterPages.some((v) => url.includes(v))) {
      return false;
    } else {
      return true;
    }
  }
}
