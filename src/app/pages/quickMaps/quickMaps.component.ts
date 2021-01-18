import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { QuickMapsRouteData } from './quickMaps-routing.module';
import { QuickMapsService } from './quickMaps.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-quickmaps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent implements OnInit {

  public showHeader = false;

  constructor(
    router: Router,
    private activatedRoute: ActivatedRoute,
    public quickMapsService: QuickMapsService,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = this.activatedRoute.firstChild.data.subscribe((data: QuickMapsRouteData) => {
          if (null != subs) {
            subs.unsubscribe();
          }
          this.showHeader = (null == data.showQuickMapsHeader) || (false !== data.showQuickMapsHeader);
          // console.log('data', this.showHeader, data);
        });
      }
    });
  }

  ngOnInit(): void {
  }

}
