import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-maps-tool',
  templateUrl: './mapsTool.component.html',
  styleUrls: ['./mapsTool.component.scss'],
})
export class MapsToolComponent {
  public ROUTES = AppRoutes;
  public defaultParamsCE = {
    'country-id': 'MWI',
    'mnd-id': 'Ca',
  };

  constructor(private sharingService: SharingService) {}

  public share(text: string, title?: string, url?: string): Promise<unknown> {
    return this.sharingService.doShare(text, title, url);
  }
}
