import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONNECT } from './API';

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {

  private readonly http = inject(HttpClient);
  private url = API_CONNECT;

  getMantenimientos(){
    return this.http.get(`${this.url}mantenimientos`);
  }

  addMantenimiento(mantenimiento: oMantenimiento){
    return this.http.post(`${this.url}mantenimientos`, mantenimiento);
  }

  editMantenimiento(id: any, mantenimiento: oMantenimiento){
    return this.http.put(`${this.url}mantenimientos/${id}`, mantenimiento);
  }

  constructor() { }
}

export interface oMantenimiento{
  _id?: string;
  codigo: string;
  titulo: string;
  descripcion: string;
}
