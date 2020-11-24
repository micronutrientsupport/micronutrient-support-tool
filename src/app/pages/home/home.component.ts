import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { NgNavigatorShareService } from 'ng-navigator-share';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public ROUTES = AppRoutes;
  constructor(private ngNavigatorShareService: NgNavigatorShareService) {}

  public share(text: string, title?: string, url?: string): void {
    this.ngNavigatorShareService
      .share({
        title,
        text,
        url,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
