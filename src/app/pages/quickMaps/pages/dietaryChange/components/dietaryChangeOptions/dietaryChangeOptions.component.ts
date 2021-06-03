/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';

@Unsubscriber('subscriptions')
@Component({
  selector: 'app-dc-options',
  templateUrl: './dietaryChangeOptions.component.html',
  styleUrls: ['./dietaryChangeOptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DietaryChangeOptionsComponent {
  public loading: boolean;

  public ROUTES = AppRoutes;

  private subscriptions = new Array<Subscription>();

  constructor(private cdr: ChangeDetectorRef) {}
}
