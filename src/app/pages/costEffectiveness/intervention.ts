// Temporary object until implementation of API
export interface Intervention {
  name: string;
  baseYear: number;
  totalCost: number;
  assumptionConfirmation: boolean;
  costsConfirmation: boolean;
}

export const Interventions: Array<Intervention> = [
  {
    name: 'Wheat flour fortification',
    baseYear: 2021,
    totalCost: 127775150,
    assumptionConfirmation: true,
    costsConfirmation: true,
  },
  {
    name: 'Supplemantation',
    baseYear: 2021,
    totalCost: 150000000,
    assumptionConfirmation: false,
    costsConfirmation: false,
  },
  {
    name: 'Wheat flour fortification',
    baseYear: 2021,
    totalCost: 175000000,
    assumptionConfirmation: false,
    costsConfirmation: false,
  },
];
