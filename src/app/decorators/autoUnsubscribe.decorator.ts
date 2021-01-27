/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * Attempts to unsubscribe from any subscriptions that have been signed up to
 * when the ngOnDestroy method is called on a object with a lifecycle.
 */
export function AutoUnsubscribe(blackList: Array<unknown> = []): (constructor: any) => void {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unsubscriber = (property: unknown, propName: string) => {
    // tslint:disable-next-line: no-string-literal
    if ((property != null) && (typeof property['unsubscribe'] === 'function')) {
      // console.debug('AutoUnsubscribe unsubscriber', propName, property);
      // tslint:disable-next-line: no-string-literal
      property['unsubscribe']();
    }
  };

  return (constructor: any) => {
    // console.debug('AutoUnsubscribe', constructor);
    const original: () => void = constructor.prototype.ngOnDestroy;

    // tslint:disable-next-line: typedef
    constructor.prototype.ngOnDestroy = function () {
      for (const prop of Object.keys(this)) {
        const property = this[prop];
        if (blackList.indexOf(prop) === -1) {
          if (property) {
            if (Array.isArray(property)) {
              for (const element of property) {
                unsubscriber(element, prop);
              }
            } else {
              unsubscriber(property, prop);
            }
          }
        }
      }
      if (original && typeof original === 'function') {
        original.apply(this);
      }
    };
  };
}
