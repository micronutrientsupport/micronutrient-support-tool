/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Attempts to unsubscribe from any subscriptions that have been signed up to
 * when the ngOnDestroy method is called on a object with a lifecycle.
 */
export function AutoUnsubscribe(blackList: Array<unknown> = []): (constructor: any) => void {

  const unsubscriber = (property: Record<string, unknown>) => {
    if ((property != null) && (typeof property.unsubscribe === 'function')) {
      property.unsubscribe();
    }
  };

  return (constructor: any) => {
    const original: () => void = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = (...args: any) => {
      for (const prop of Object.keys(this)) {
        const property = this[prop];
        if (blackList.indexOf(prop) === -1) {
          if (property) {
            if (Array.isArray(property)) {
              for (const element of property) {
                unsubscriber(element);
              }
            } else {
              unsubscriber(property);
            }
          }
        }
      }
      if (original && typeof original === 'function') {
        original.apply(this, args);
      }
    };
  };
}
