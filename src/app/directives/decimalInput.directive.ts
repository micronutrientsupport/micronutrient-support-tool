import { Directive, ElementRef, HostListener } from '@angular/core';

// import { NG_VALIDATORS } from '@angular/forms';
@Directive({
  selector: '[appDecimalInput]',

  // providers: [
  //   {
  //     provide: NG_VALIDATORS,
  //     useExisting: DecimalInputDirective,
  //     multi: true,
  //   },
  // ],
})
export class DecimalInputDirective {
  title = 'Directive';
  // Allow numbers with 2 decimal figures
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    // const position = this.el.nativeElement[0];
    console.log('directive working?', this.el.nativeElement[0]);
    const next: string = [
      current.slice(0, position),
      event.key == 'Decimal' ? '.' : event.key,
      current.slice(position),
    ].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
