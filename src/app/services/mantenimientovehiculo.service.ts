import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONNECT } from './API';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenimientovehiculoService {

  private readonly http = inject(HttpClient);
  private url = API_CONNECT;

  getMantenimientosV(): Observable<any>{
    return this.http.get(`${this.url}vehiculo-mantenimientos`);
  }

  filtrarMantenimientosV(search: string): Observable<any> {
    return this.http.get(`${this.url}vehiculo-mantenimientos/filtrar`, { params: { search } });
  }

  addMantenimientoV(mantenimientov: oMantenimientoVehiculo){
    return this.http.post(`${this.url}vehiculo-mantenimientos`, mantenimientov);
  }

  editMantenimientoV(id: any, mantenimientov: oMantenimientoVehiculo){
    return this.http.put(`${this.url}vehiculo-mantenimientos/${id}`, mantenimientov);
  }


  constructor() { }
}

export interface oMantenimientoVehiculo{
  _id?: string;
  fecha?: Date;
  codigo?: string;
  placa?: string;
  precio: string;
  marca_producto?: string;
  kilometraje?: number;
  alerta?: string;
}
