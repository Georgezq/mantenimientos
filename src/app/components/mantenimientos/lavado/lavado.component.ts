import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MantenimientosService } from '../../../services/mantenimientos.service';
import { MantenimientovehiculoService } from '../../../services/mantenimientovehiculo.service';
import { ModalService } from '../../../services/modal.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-lavado',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './lavado.component.html',
  styleUrl: './lavado.component.css'
})
export class LavadoComponent implements OnInit{

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
      placa: ['',],
      precio: [''],
      marca_producto: ['', null],
      kilometraje: ['', null],
   });
  }

  MantenimientoAceite(){
    const newMantenimiento: oMantenimientoVehiculo = {
      fecha: new Date(),
      codigo: this.mantenimientoV.value.codigo,
      placa: this.mantenimientoV.value.placa,
      precio: this.mantenimientoV.value.precio,
      marca_producto: this.mantenimientoV.value.marca_producto,
      kilometraje: this.mantenimientoV.value.kilometraje
    };

    console.log(newMantenimiento)

    this.mantenimientoV$.addMantenimientoV(newMantenimiento).subscribe(
      (res:any) => {
        this.cerrarModal();
        this.mantenimientoV.patchValue({
          placa: '',
          marca_producto: '',
          kilometraje: '',
          precio: ''
        });
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
          if(res.codigo == "2" ){
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

    this.modalService.mostrarModalLavado$.subscribe((value) => {
      this.mostrarModal = value;
    });

    this.modalService.placaL$.subscribe((placa) => {
      this.placa = placa;
      this.mantenimientoV.patchValue({
        placa: this.placa,
      })
    });
  }


  cerrarModal() {
    this.modalService.cerrarModalLavado();
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
  precio: string;
  marca_producto?: string;
  kilometraje?: number;
  alerta?: string;
}

