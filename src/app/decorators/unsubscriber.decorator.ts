
/**
 * Attempts to unsubscribe from any subscriptions that have been signed up to
 * when the ngOnDestroy method is called on a object with a lifecycle.
 */
export function Unsubscriber(unsubscribePropertyNames: string | Array<string> = []): (constructor: unknown) => void {

  const tryUnsubscribe = (property) => {
    // console.debug('tryUnsubscribe', variable);
    if (
      (null != property) // not null
      && (typeof property.unsubscribe === 'function')
    ) {
      // console.debug('Unsubscribe', variable);
      property.unsubscribe();
    }
  };

  const unsubscribeProperty = (property) => {
    if (null == property) {
      if (Array.isArray(property)) {
        property.forEach((element: unknown) => {
          if (null != element) {
            tryUnsubscribe(element);
          }
        });
      } else {
        tryUnsubscribe(property);
      }
    }
  };

  return (constructor: unknown) => {
    const propNames = (Array.isArray(unsubscribePropertyNames)) ? unsubscribePropertyNames : [unsubscribePropertyNames];

    // tslint:disable-next-line: no-string-literal
    const original = constructor['prototype'].ngOnDestroy;

    // tslint:disable-next-line: no-string-literal
    constructor['prototype'].ngOnDestroy = function(): void {
      // console.debug('onDestroy', constructor);
      propNames.forEach((propName: string) => {
        if (undefined === this[propName]) {
          console.log('Cannot unsubscribe from undefined:', propName, this);
        } else {
          unsubscribeProperty(this[propName]);
        }
      });

      if (original && typeof original === 'function') {
        original.apply(this, arguments);
      }
    };
  };
}
