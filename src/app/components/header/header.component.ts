import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public ROUTES = AppRoutes;
}
