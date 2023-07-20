// Temporary object until implementation of API
export interface SimpleIntervention {
  name: string;
  baseYear: number;
  totalCost: number;
  assumptionConfirmation: boolean;
  costsConfirmation: boolean;
  userId: string;
}

export const SimpleInterventions: Array<SimpleIntervention> = [
  {
    name: 'Wheat flour fortification',
    baseYear: 2021,
    totalCost: 127775150,
    assumptionConfirmation: true,
    costsConfirmation: true,
    userId: '',
  },
  {
    name: 'Supplementation',
    baseYear: 2021,
    totalCost: 150000000,
    assumptionConfirmation: false,
    costsConfirmation: false,
    userId: '',
  },
  {
    name: 'Wheat flour fortification',
    baseYear: 2021,
    totalCost: 175000000,
    assumptionConfirmation: false,
    costsConfirmation: false,
    userId: '',
  },
];
