import { Component, inject, OnInit } from '@angular/core';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mantenimiento-v',
  standalone: true,
  imports: [],
  templateUrl: './mantenimiento-v.component.html',
  styleUrl: './mantenimiento-v.component.css'
})
export class MantenimientoVComponent implements OnInit{

  private mantenimiento$ = inject(MantenimientosService);
  private vehiculos$ = inject(VehiculosService);
  route$ = inject(ActivatedRoute);
  vehiculoId = this.route$.snapshot.paramMap.get('id');
  mantenimiento: oMantenimiento[] = [];
  codigo: any;

  MantenimientoAceite(){
    this.mantenimiento$.getMantenimientos().subscribe(
      (res:any) => {
        this.mantenimiento = res;
        //Obtener solo el mantenimiento del aceite
        this.mantenimiento.forEach((res) => {
          if(res.codigo == "1" ){
            //Obtener los parametros del vehiculo segun su ID
            this.vehiculos$.getVehiculosById(this.vehiculoId).subscribe(
              (res:any) => {
                console.log(res.placa);
              }
            )
          }
        })
      }
    )
  }

  ngOnInit(): void {
    this.MantenimientoAceite();
  }

}

export interface oMantenimiento{
  _id?: string;
  codigo: string;
  titulo: string;
  descripcion: string;
}
