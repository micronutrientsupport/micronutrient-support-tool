import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

  public functionExpand(): void {

  }

  public functionSettings(): void {

  }

}
