import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BehaviorSubject } from 'rxjs';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-costEffectivenessSelectionDialog',
  templateUrl: './costEffectivenessSelectionDialog.component.html',
  styleUrls: ['./costEffectivenessSelectionDialog.component.scss'],
})
export class CostEffectivenessSelectionDialogComponent implements OnInit {
  public interventions: Array<InterventionsDictionaryItem>;
  public selectedIntervention: Intervention;
  public interventionId = '';
  public tabID = 'copy';
  public err = new BehaviorSubject<boolean>(false);
  public interventionForm: UntypedFormGroup;
  public proceed = new BehaviorSubject<boolean>(false);
  public showResults = new BehaviorSubject<boolean>(false);

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.interventions = dialogData.dataIn as Array<InterventionsDictionaryItem>;
  }

  ngOnInit(): void {
    this.createInterventionForm();
    this.interventionForm.valueChanges.subscribe((fields) => {
      if (fields.newInterventionName !== '') {
        this.proceed.next(true);
      } else {
        this.proceed.next(false);
      }
    });
  }

  private createInterventionForm() {
    this.interventionForm = this.formBuilder.group({
      newInterventionName: new UntypedFormControl('', [Validators.required]),
      newInterventionDesc: new UntypedFormControl(''),
    });
  }

  public getInterventionById(id: string) {
    this.interventionDataService
      .getIntervention(id)
      .then((response) => {
        this.err.next(false);
        this.selectedIntervention = response;
        this.proceed.next(true);
      })
      .catch((err) => {
        console.error(err);
        this.err.next(true);
      });
  }

  private createInterventionCopy(newName: string, newDesc: string): void {
    this.interventionDataService
      .setIntervention(Number(this.selectedIntervention.id), newName, newDesc)
      .then((result) => {
        this.dialogData.dataOut = result;
        this.closeDialog();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  public handleTabChange(event: MatTabChangeEvent): void {
    this.interventionForm.reset();
    this.proceed.next(false);
    this.showResults.next(false);
    this.interventionId = '';

    switch (true) {
      case event.index === 0:
        this.tabID = 'copy';
        break;
      case event.index === 1:
        this.tabID = 'load';
        break;
    }
    this.proceed.next(false);
  }

  public handleLookup(): void {
    this.getInterventionById(this.interventionId);
    this.showResults.next(true);
  }

  public handleChange(): void {
    this.proceed.next(false);
    this.showResults.next(false);
    this.err.next(false);
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  public handleSubmit(): void {
    const formData = this.interventionForm.value;
    if (this.interventionForm.valid) {
      this.createInterventionCopy(formData.newInterventionName, formData.newInterventionDesc);
    }
  }

  public createIntervention(): void {
    if (this.tabID === 'load') {
      if (this.selectedIntervention !== null) {
        this.dialogData.dataOut = this.selectedIntervention;
        this.closeDialog();
      }
    }
  }
}
