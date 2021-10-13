import moment from 'moment-es6';

export class Month {
  public readonly name: string;
  public readonly shortName: string;

  constructor(public readonly index: number) {
    const myMoment = moment(String(index), 'M');
    this.name = myMoment.format('MMMM');
    this.shortName = myMoment.format('MMM');
  }
}
