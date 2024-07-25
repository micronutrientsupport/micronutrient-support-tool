import { BaseObject } from '../../_lib_code/objects/baseObject';

export type BiomarkerThreshold = {
  upper: number;
  lower: number;
  thresholdType: string;
  condition: string;
  comments: string;
};

export interface BiomarkerThresholdList {
  [key: string]: BiomarkerThreshold;
}
