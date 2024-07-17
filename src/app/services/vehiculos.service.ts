import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONNECT } from './API';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  private readonly http = inject(HttpClient);
  private url = API_CONNECT;

  getVehiculos(){
    return this.http.get(`${this.url}vehiculos`);
  }

  getVehiculosById(id: any){
    return this.http.get(`${this.url}vehiculos/${id}`);
  }

  filtrarVehiculos(search: string): Observable<any> {
    return this.http.get(`${this.url}vehiculos/filtrar`, { params: { search } });
  }

  addVehiculos(vehiculo: oVehiculos){
    return this.http.post(`${this.url}vehiculos`, vehiculo);
  }

  editVehiculo(idvehiculo: any, vehiculo: oVehiculos){
    return this.http.put(`${this.url}vehiculos/${idvehiculo}`, vehiculo);
  }

  deleteVehiculos(idvehiculo: any){
    return this.http.delete(`${this.url}vehiculos/${idvehiculo}`,);
  }

  constructor() { }

}

export interface oVehiculos{
  _id?: string;
  imagen: string;
  marca: string;
  modelo: string;
  placa: string;
  anio: number;
}

