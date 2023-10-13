// Temporary object until implementation of API
export interface SimpleIntervention {
  name: string;
  id: number;
  baseYear: number;
  totalCost: number;
  description: string;
  lastEdited: string;
  userId: string;
  focusMicronutrient: string;
  focusNation: string;
}

export const SimpleInterventions: Array<SimpleIntervention> = [
  {
    name: 'Wheat flour fortification',
    id: 1234,
    baseYear: 2021,
    totalCost: 127775150,
    description: 'Wheat flour description',
    lastEdited: '',
    userId: '',
    focusMicronutrient: 'A',
    focusNation: 'ETH',
  },
  {
    name: 'Supplementation',
    id: 1234,
    baseYear: 2021,
    totalCost: 150000000,
    description: 'Supplementation description',
    lastEdited: '',
    userId: '',
    focusMicronutrient: 'Ca',
    focusNation: 'ETH',
  },
  {
    name: 'Wheat flour fortification',
    id: 1234,
    baseYear: 2021,
    totalCost: 175000000,
    description: 'Wheat flour description',
    lastEdited: '',
    userId: '',
    focusMicronutrient: 'Fe',
    focusNation: 'MWI',
  },
];
