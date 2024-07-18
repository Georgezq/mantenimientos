import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private mostrarModalCambioSubject  = new BehaviorSubject<boolean>(false);
  private mostrarModalLavadoSubject  = new BehaviorSubject<boolean>(false);
  private placaVSubject  = new BehaviorSubject<string>('');
  private placaLSubject  = new BehaviorSubject<string>('');

  mostrarModal$ = this.mostrarModalCambioSubject .asObservable();
  mostrarModalLavado$ = this.mostrarModalLavadoSubject .asObservable();
  placaV$ = this.placaVSubject .asObservable();
  placaL$ = this.placaLSubject .asObservable();

  mostrarModalCambioA(placa:string) {
    this.mostrarModalCambioSubject.next(true);
    this.placaVSubject.next(placa)
  }

  cerrarModalCambioA() {
    this.mostrarModalCambioSubject.next(false);
  }

  mostrarModalLavado(placa:string) {
    this.mostrarModalLavadoSubject.next(true);
    this.placaLSubject.next(placa)
  }

  cerrarModalLavado() {
    this.mostrarModalLavadoSubject.next(false);
  }

}
