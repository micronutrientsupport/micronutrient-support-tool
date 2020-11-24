import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public ROUTES = AppRoutes;
  constructor(private sharingService: SharingService) {}

  public share(text: string, title?: string, url?: string): void {
    this.sharingService.shareApi(text, title, url);
  }
}
