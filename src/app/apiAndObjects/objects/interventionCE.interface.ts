export interface CEFormBody {
  nation: string;
  focusGeography: string;
  focusMicronutrient: string;
  interventionType: string;
  foodVehicle: string;
  interventionStatus: object;
  interventionNature: object;
}

export interface InterventionCERequest {
  parentInterventionId: number;
  newInterventionName: string;
  newInterventionDescription: string;
  newInterventionNation: string;
  newInterventionFocusGeography: string;
  newInterventionFocusMicronutrient: string;
  newInterventionNature;
  newInterventionStatus;
}
