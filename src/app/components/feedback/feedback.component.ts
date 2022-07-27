import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { detect } from 'detect-browser';
import { ApiService } from '../../apiAndObjects/api/api.service';
import { PostFeedbackParams } from 'src/app/apiAndObjects/api/feedback/postFeedback';
import { NotificationsService } from '../notifications/notification.service';

type FeedbackEvent = Event & { detail: { description: string; screenshot: string } };

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  public screenshotDisabled = false;

  public introText = 'To provide feedback or report issues with the current page please use the box below.';
  public screenshotText =
    'The "Take Screenshot" button will allow you to optionally add a screenshot of the current page.  Areas of interest can be highlighted, and any personal data redacted';

  constructor(
    public breakpointObserver: BreakpointObserver,
    private apiService: ApiService,
    private notificationsService: NotificationsService,
  ) {}

  submitFeedback(e: FeedbackEvent) {
    const browser = detect();

    const feedback: PostFeedbackParams = {
      // Feedback content
      comment: e.detail.description,
      screenshot: e.detail.screenshot,
      rate: 5,

      // Additional metadata
      page: window.location.href,
      browser: `${browser.name.charAt(0).toUpperCase()}${browser.name.slice(1)}: ${browser.version}`,
      os: browser.os,
      height: window.innerHeight,
      width: window.innerWidth,
    };

    console.log(feedback);
    this.apiService.endpoints.misc.postFeedback
      .call(feedback)
      .then(() => {
        console.log('It was sent!');
        this.notificationsService.sendPositive('Feedback submitted - Thank you');
      })
      .catch(() => {
        this.notificationsService.sendNegative('Error submitting feedback - Please try again later');
      });
  }

  async ngOnInit() {
    // Watch breakpoints and disable screenshot on small screens
    const layoutChanges = this.breakpointObserver.observe(['(max-width: 60em)']);
    layoutChanges.subscribe((result) => {
      this.screenshotDisabled = result.matches;
    });

    // Listen for feedback posts and submit to the API
    document.querySelector('customer-feedback').addEventListener('feedback', this.submitFeedback.bind(this));
  }

  isSmallScreen = this.breakpointObserver.isMatched('(max-width: 60em)');

  doTheThing() {
    console.log(document.querySelector('customer-feedback').show());
  }
}
