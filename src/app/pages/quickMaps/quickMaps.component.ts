import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { QuickMapsService } from './quickMaps.service';
import { Subscription } from 'rxjs';
import { RouteData } from 'src/app/app-routing.module';

@Component({
  selector: 'app-quickmaps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent implements OnInit {
  public showHeader = false;

  constructor(router: Router, private activatedRoute: ActivatedRoute, public quickMapsService: QuickMapsService) {
    router.events.subscribe((event) => {
      // console.log('quickmaps = ', event);
      if (event instanceof NavigationEnd) {
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = this.activatedRoute.firstChild.data.subscribe((data: RouteData) => {
          if (null != subs) {
            subs.unsubscribe();
          }
          this.showHeader = null == data.showQuickMapsHeader || false !== data.showQuickMapsHeader;
          // console.log('this.showHeader, data = ', this.showHeader, data);
        });
      }
    });
  }

  ngOnInit(): void {}
}
