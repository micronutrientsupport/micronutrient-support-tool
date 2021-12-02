import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-ce-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(private dialogService: DialogService) {
    // add content
  }

  ngOnInit(): void {
    // add content
  }

  public openCEInfoDialog(): void {
    void this.dialogService.openCEInfoDialog();
  }
}
