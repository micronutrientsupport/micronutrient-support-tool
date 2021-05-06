import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NotificationComponent } from './notification.component';
import { NotificationData } from './notificationData';
import { NotificationType } from './notificationType.enum';
import { delay, filter, map, take, takeUntil, tap } from 'rxjs/operators';
@Injectable()
export class NotificationsService implements OnDestroy {
  private readonly snackBarQueueSrc = new BehaviorSubject<Array<NotificationData>>([]);
  private readonly snackBarQueueObservable = this.snackBarQueueSrc.asObservable();
  private readonly ngDestroy = new Subject();
  constructor(private newNotification: MatSnackBar) {
    /* Dispatches all queued snack bars one by one */
    this.snackBarQueueObservable
      .pipe(
        filter((queue) => queue.length > 0 && !queue[0].beingDispatched),
        tap(() => {
          const updatedQueue = this.snackBarQueueSrc.value;
          updatedQueue[0].beingDispatched = true;
          this.snackBarQueueSrc.next(updatedQueue);
        }),
        map((queue) => queue[0]),
        takeUntil(this.ngDestroy),
      )
      .subscribe((snackBarItem) => this.showSnackbar(snackBarItem));
  }

  public ngOnDestroy(): void {
    this.snackBarQueueSrc.next([]);
    this.snackBarQueueSrc.complete();
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  public sendInformative(message: string, boldMessage?: string, duration = 3000): void {
    const notificationData: NotificationData = {
      type: NotificationType.INFORMATION,
      message: message,
      boldMessage: boldMessage,
      duration: duration,
      beingDispatched: false,
    };
    this.sendNotification(notificationData);
  }

  public sendNegative(message: string, boldMessage?: string, duration = 12000): void {
    const notificationData: NotificationData = {
      type: NotificationType.NEGATIVE,
      message: message,
      boldMessage: boldMessage,
      duration: duration,
      beingDispatched: false,
    };
    this.sendNotification(notificationData);
  }

  public sendPositive(message: string, boldMessage?: string, duration = 3000): void {
    const notificationData: NotificationData = {
      type: NotificationType.POSITIVE,
      message: message,
      boldMessage: boldMessage,
      duration: duration,
      beingDispatched: false,
    };
    this.sendNotification(notificationData);
  }

  public sendNotification(notificationData: NotificationData): void {
    this.snackBarQueueSrc.next(this.snackBarQueueSrc.value.concat([notificationData]));
  }

  private showSnackbar(notificationData: NotificationData) {
    this.removeDismissedSnackBar(
      this.newNotification
        .openFromComponent(NotificationComponent, {
          panelClass: ['maps-snackbar'],
          duration: notificationData.duration,
          data: notificationData,
        })
        .afterDismissed(),
    );
  }

  /* Remove dismissed snack bar from queue and triggers another one to appear */
  private removeDismissedSnackBar(dismissed: Observable<MatSnackBarDismiss>) {
    dismissed.pipe(delay(1000), take(1)).subscribe(() => {
      const updatedQueue = this.snackBarQueueSrc.value;
      if (updatedQueue[0].beingDispatched) {
        updatedQueue.shift();
      }
      this.snackBarQueueSrc.next(updatedQueue);
    });
  }
}
