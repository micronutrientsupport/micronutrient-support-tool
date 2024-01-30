import { Injector } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DietaryChangeMode } from '../pages/dietaryChange/dietaryChangeMode.enum';
import { Converter } from './converters/converter.abstract';
import { DictItemConverter } from './converters/dictItemConverter';
import { EnumConverter } from './converters/enumConverter';
import { QuickMapsQueryParamKey } from './quickMapsQueryParamKey.enum';
import { StringConverter } from './converters/stringConverter';

export class QuickMapsQueryParams {
  private readonly dictionariesService: DictionaryService;
  private readonly router: Router;
  private readonly route: ActivatedRoute;

  constructor(private injector: Injector) {
    this.dictionariesService = injector.get<DictionaryService>(DictionaryService);
    this.router = injector.get<Router>(Router);
    this.route = injector.get<ActivatedRoute>(ActivatedRoute);
  }

  public get<T>(converter: Converter<T>, queryParamMap?: ParamMap): Converter<T> {
    return converter.setString(this.params(queryParamMap).get(converter.queryStringkey));
  }

  public getCountry(queryParamMap?: ParamMap): Promise<CountryDictionaryItem> {
    return this.get(
      new DictItemConverter<CountryDictionaryItem>(QuickMapsQueryParamKey.COUNTRY_ID, DictionaryType.COUNTRIES),
      queryParamMap,
    ).getItem(this.injector);
  }
  public getMicronutrient(queryParamMap?: ParamMap): Promise<MicronutrientDictionaryItem> {
    return this.get(
      new DictItemConverter<MicronutrientDictionaryItem>(
        QuickMapsQueryParamKey.MICRONUTRIENT_ID,
        DictionaryType.MICRONUTRIENTS,
      ),
      queryParamMap,
    ).getItem(this.injector);
  }
  public getAgeGenderGroup(queryParamMap?: ParamMap): Promise<AgeGenderDictionaryItem> {
    return this.get(
      new DictItemConverter<AgeGenderDictionaryItem>(
        QuickMapsQueryParamKey.AGE_GENDER_GROUP_ID,
        DictionaryType.AGE_GENDER_GROUPS,
      ),
      queryParamMap,
    ).getItem(this.injector);
  }

  public getMeasure(queryParamMap?: ParamMap): Promise<MicronutrientMeasureType> {
    return this.get(
      new EnumConverter<MicronutrientMeasureType>(QuickMapsQueryParamKey.MEASURE, MicronutrientMeasureType, true),
      queryParamMap,
    ).getItem();
  }

  public getScenarioMode(queryParamMap?: ParamMap): Promise<DietaryChangeMode> {
    return this.get(
      new EnumConverter<DietaryChangeMode>(QuickMapsQueryParamKey.SCENARIO_MODE, DietaryChangeMode, false),
      queryParamMap,
    ).getItem();
  }

  public getAggregationField(queryParamMap?: ParamMap): Promise<string> {
    return this.get(new StringConverter(QuickMapsQueryParamKey.AGGREGATION_FIELD), queryParamMap).getItem();
  }

  public setQueryParams(converters: Array<Converter>): void {
    const stringParams: Record<string, string> = {};
    // convert Array values to strings
    converters.forEach((converter: Converter) => {
      // console.debug('converter', converter, converter.getString());
      const trimmedValue = converter.getString().trim();
      stringParams[converter.queryStringkey] = trimmedValue;
    });
    void this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true, // replace in history
      queryParams: stringParams,
      queryParamsHandling: 'merge',
    });
  }

  private params(queryParamMap?: ParamMap): ParamMap {
    // console.debug('this.route.snapshot.queryParamMap', this.route.snapshot);
    return null != queryParamMap ? queryParamMap : this.route.snapshot.queryParamMap;
  }
}
