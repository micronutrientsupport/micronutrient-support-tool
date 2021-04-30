/* eslint-disable @typescript-eslint/dot-notation */
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { Component } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import { SharingService } from 'src/app/services/sharing.service';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { GridsterService, GridsterSource } from 'src/app/services/gridster.service';
@Component({
  selector: 'app-quick-maps-header',
  templateUrl: './quickMapsHeader.component.html',
  styleUrls: ['./quickMapsHeader.component.scss'],
})
export class QuickMapsHeaderComponent {
  public readonly ROUTES = AppRoutes;
  public readonly MEASURE_TYPES = MicronutrientMeasureType;
  public gridsterSource = GridsterSource;
  constructor(
    public route: ActivatedRoute,
    public quickMapsService: QuickMapsService,
    private router: Router,
    private sharingService: SharingService,
    private gridsterService: GridsterService,
  ) {}

  public share(text: string, title?: string): Promise<any> {
    return this.sharingService.share(text, title, window.location.href);
  }
  public resetGridster(): void {
    const page = this.router.url.split('?')[0].split('/').pop();
    switch (page) {
      case 'baseline': {
        this.gridsterService.setGridsterReset(this.gridsterSource.BASELINE);
        break;
      }
      case 'projection': {
        this.gridsterService.setGridsterReset(this.gridsterSource.PROJECTION);
        break;
      }
    }
  }
}
