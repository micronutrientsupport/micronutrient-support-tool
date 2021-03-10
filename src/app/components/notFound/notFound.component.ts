import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-not-found',
  templateUrl: './notFound.component.html',
  styleUrls: ['./notFound.component.scss'],
})
export class NotFoundComponent implements OnInit {
  public path: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe((data: { path: string }) => {
      if (data.path) {
        this.path = data.path.slice(1);
      }
    });
  }
}
