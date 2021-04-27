/* eslint-disable @typescript-eslint/dot-notation */
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { Component } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import { SharingService } from 'src/app/services/sharing.service';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
@Component({
  selector: 'app-quick-maps-header',
  templateUrl: './quickMapsHeader.component.html',
  styleUrls: ['./quickMapsHeader.component.scss'],
})
export class QuickMapsHeaderComponent {
  public ROUTES = AppRoutes;
  constructor(
    public route: ActivatedRoute,
    public quickMapsService: QuickMapsService,
    private sharingService: SharingService,
  ) {}

  public share(text: string, title?: string): Promise<any> {
    return this.sharingService.share(text, title, window.location.href);
  }
  public get MicronutrientMeasureType(): typeof MicronutrientMeasureType {
    return MicronutrientMeasureType;
  }
}
