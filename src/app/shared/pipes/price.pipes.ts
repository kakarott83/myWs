import { Pipe, PipeTransform } from '@angular/core';

/**
 * PricePipe – formatiert Cents zu Euro-Beträgen (z. B. 1999 -> 19,99 €)
 */
@Pipe({
  name: 'price',
  standalone: true // <– macht die Pipe unabhängig von Modulen
})
export class PricePipe implements PipeTransform {

  transform(cents: number, currency: string = '€'): string {
    if (cents == null) return ''; // Falls kein Wert vorhanden ist
    const value = (cents).toFixed(2).replace('.', ','); // Komma statt Punkt
    return `${value}\u00A0${currency}`; // \u00A0 = geschütztes Leerzeichen
  }
}