import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONNECT } from './API';

@Injectable({
  providedIn: 'root'
})
export class MantenimientovehiculoService {

  private readonly http = inject(HttpClient);
  private url = API_CONNECT;

  getMantenimientosV(){
    return this.http.get(`${this.url}vehiculo-mantenimientos`);
  }

  addMantenimientoV(mantenimientov: oMantenimientoVehiculo){
    return this.http.post(`${this.url}vehiculo-mantenimientos`, mantenimientov);
  }

  editMantenimientoV(id: any, mantenimientov: oMantenimientoVehiculo){
    return this.http.put(`${this.url}vehiculo-mantenimientos/${id}`, mantenimientov);
  }

  filtrarMantenimientoV(){
    return this.http.get(`${this.url}vehiculo-mantenimientos/alertas`)
  }

  constructor() { }
}

export interface oMantenimientoVehiculo{
  _id?: string;
  fecha?: Date;
  codigo?: string;
  placa?: string;
  marca_producto?: string;
  kilometraje?: number;
  alerta?: string;
}
