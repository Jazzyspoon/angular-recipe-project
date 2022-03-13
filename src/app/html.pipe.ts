import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htMl',
})
export class HtmlPipe implements PipeTransform {
  transform(value) {
    var doc = new DOMParser().parseFromString(value, 'text/html');
    const value123 = doc.documentElement.textContent;
    return value123;
  }
}
