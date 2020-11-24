import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { MatDialog } from '@angular/material/dialog';
import { DialogShareComponent } from 'src/app/components/dialog/share/dialogShare.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public ROUTES = AppRoutes;
  constructor(private ngNavigatorShareService: NgNavigatorShareService, private dialog: MatDialog) {}

  public share(text: string, title?: string, url?: string): void {
    if (!this.ngNavigatorShareService.canShare()) {
      console.log(`This service/api is not supported in your Browser`);
      this.dialog.open(DialogShareComponent, { data: { shareLink: 'bing' } });
      return;
    }

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
