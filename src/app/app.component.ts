import { Component } from '@angular/core';
import { GuardsCheckEnd, GuardsCheckStart, Router } from '@angular/router';
import { PageLoadingService } from './services/pageLoadingService.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    router: Router,
    public pageLoadingService: PageLoadingService,
  ) {
    // on navigation, guard checking can take a little time, so show page loading indicator
    router.events.subscribe(event => {
      if (event instanceof GuardsCheckStart) {
        this.pageLoadingService.showLoading(true);
        // console.log('GuardStart');
      }
      if (event instanceof GuardsCheckEnd) {
        this.pageLoadingService.showLoading(false);
        // console.log('GuardEnd');
      }
    });
  }


}
