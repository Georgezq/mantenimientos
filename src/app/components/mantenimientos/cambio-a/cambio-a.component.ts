import { Component, inject, OnInit } from '@angular/core';
import { MantenimientosService } from '../../../services/mantenimientos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MantenimientovehiculoService } from '../../../services/mantenimientovehiculo.service';
import { NgIf } from '@angular/common';
import { ModalService } from '../../../services/modal.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cambio-a',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './cambio-a.component.html',
  styleUrl: './cambio-a.component.css'
})
export class CambioAComponent implements OnInit{

  private mantenimiento$ = inject(MantenimientosService);
  private mantenimientoV$ = inject(MantenimientovehiculoService);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  placa: any;
  mantenimientoV: FormGroup;
  mostrarModal = false;
  alerta: any;

  mantenimiento: oMantenimiento[] = [];

  private inicializarFormulario(): void {
    this.mantenimientoV = this.fb.group({
      codigo: [''],
      placa: [''],
      marca_producto: [''],
      kilometraje: [''],
   });
  }

  MantenimientoAceite(){
    const newMantenimiento: oMantenimientoVehiculo = {
      fecha: new Date(),
      codigo: this.mantenimientoV.value.codigo,
      placa: this.mantenimientoV.value.placa,
      marca_producto: this.mantenimientoV.value.marca_producto,
      kilometraje: this.mantenimientoV.value.kilometraje
    };


    this.mantenimientoV$.addMantenimientoV(newMantenimiento).subscribe(
      (res:any) => {
        this.cerrarModal();
        this.mantenimientoV.reset();
        this.alerta = res.alerta;
        Swal.fire({
          title: '¡Importante!',
          text: `${this.alerta}`,
          icon: 'info'
        })
      }
    )
  }

  obtenerCodigo(){
    this.mantenimiento$.getMantenimientos().subscribe(
      (res:any) =>{
        this.mantenimiento = res;
        this.mantenimiento.forEach((res) =>{
          if(res.codigo == "1" ){
            const codigo = res.codigo;
            this.mantenimientoV.patchValue({
              codigo: codigo
            })
          }
        })
      }
    )
  }

  ngOnInit(): void {
   // this.MantenimientoAceite();
    this.inicializarFormulario();
    this.obtenerCodigo();

    this.modalService.mostrarModal$.subscribe((value) => {
      this.mostrarModal = value;
    });

    this.modalService.placaV$.subscribe((placa) => {
      this.placa = placa;
      this.mantenimientoV.patchValue({
        placa: this.placa,
      })
    });
  }


  cerrarModal() {
    this.modalService.cerrarModalCambioA();
  }

}

export interface oMantenimiento{
  _id?: string;
  codigo: string;
  titulo: string;
  descripcion: string;
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

