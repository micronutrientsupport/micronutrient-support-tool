import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { MatDialog } from '@angular/material/dialog';
import { DialogShareComponent } from 'src/app/components/dialog/share/dialogShare.component';
import { Router } from '@angular/router';
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
    this.sharingService.share(text, title, url);
  }
}
