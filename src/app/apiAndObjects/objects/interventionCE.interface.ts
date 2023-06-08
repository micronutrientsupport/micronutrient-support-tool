export interface CEFormBody {
  nation: string;
  focusGeography: string;
  focusMicronutrient: string;
  interventionType: string;
  foodVehicle: string;
  interventionStatus: string;
}

export interface InterventionCERequest {
  parentInterventionId: number;
  newInterventionName: string;
  newInterventionDescription: string;
  newInterventionNation: string;
  newInterventionFocusGeography: string;
  newInterventionFocusMicronutrient: string;
}
