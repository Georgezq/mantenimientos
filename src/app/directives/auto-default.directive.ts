import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoDefault]',
  standalone: true
})
export class AutoDefaultDirective {

  constructor(private elementImg: ElementRef) { }

  @HostListener('error')

  onError():void{
    this.elementImg.nativeElement.src = '../../assets/default-image.jpg'
  }

}
