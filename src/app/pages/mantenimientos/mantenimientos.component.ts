import { Component, inject, OnInit } from '@angular/core';
import { MantenimientovehiculoService } from '../../services/mantenimientovehiculo.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './mantenimientos.component.html',
  styleUrl: './mantenimientos.component.css'
})
export class MantenimientosComponent implements OnInit{

  private mantenimientosV$ = inject(MantenimientovehiculoService);
  mantenimiento: oMantenimientoVehiculo[] = [];

  constructor(){}

  verMantenimientosV(){
    this.mantenimientosV$.getMantenimientosV().subscribe(
      ( res : any ) => {
        this.mantenimiento = res;
      }
    )
  }

  ngOnInit(): void {
    this.verMantenimientosV()
  }

}

export interface oMantenimientoVehiculo{
  _id?: string;
  fecha: Date;
  codigo: string;
  placa: string;
  marca_producto: string;
  kilometraje: number;
  alerta: string;
}
