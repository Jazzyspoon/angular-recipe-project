import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreak',
})
export class LinebreakPipe implements PipeTransform {
  // return an array split at \\. and then add an <li> tag to the start and end with </li> for each element

  transform(value: any, ...args: any[]) {
    return (
      value
        .split('.')
        .map((x) => `<li>${x}</li>`)
        .join('')
        //wrap the whole list within in an ordered list
        .replace(/^/gm, '<ol>')
        .replace(/$/gm, '</ol>')
        //remove last child li item
        .replace(/<li><\/li>/gm, '')
    );
  }
}
