import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Output() public settingTrigger = new EventEmitter();
  @Output() public expandTrigger = new EventEmitter();

  @Input() title: string;
  @Input() showSettings: boolean;
  @Input() showExpand: boolean;
  @Input() loading = false;
  @Input() error = false;

  constructor() { }

  ngOnInit(): void {
  }

  public functionExpand(): void {
    this.expandTrigger.emit();
  }

  public functionSettings(): void {
    this.settingTrigger.emit();
  }

}
