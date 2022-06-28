import { ChangeDetectionStrategy, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

@Component({
  selector: 'app-uncertainty-description',
  templateUrl: './uncertaintyDescription.component.html',
  styleUrls: ['./uncertaintyDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncertaintyDescriptionComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;

  constructor(public quickMapsService: QuickMapsService, private cdr: ChangeDetectorRef) {}
}
