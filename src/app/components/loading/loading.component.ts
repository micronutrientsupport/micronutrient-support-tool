import { PageLoadingService } from 'src/app/services/pageLoadingService.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  constructor(
    public pageLoadingService: PageLoadingService,
  ) {
  }

}
