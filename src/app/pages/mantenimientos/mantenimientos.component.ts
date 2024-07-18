import { Component, inject, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MantenimientovehiculoService } from '../../services/mantenimientovehiculo.service';
import { CurrencyPipe, DatePipe, NgIf, } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [DatePipe, FormsModule, MatTableModule, MatPaginatorModule, CurrencyPipe, NgIf, ReactiveFormsModule],
  templateUrl: './mantenimientos.component.html',
  styleUrl: './mantenimientos.component.css'
})
export class MantenimientosComponent implements OnInit{

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mantenimiento: oMantenimientoVehiculo[] | undefined;
  displayedColumns: string[] = ['fecha','placa', 'codigo', 'marca_producto', 'precio', 'acciones'];
  private fb = inject(FormBuilder);
  private mantenimientosV$ = inject(MantenimientovehiculoService);
  isLoading: boolean;
  search: string = '';
  dataSource: MatTableDataSource<oMantenimientoVehiculo> = new MatTableDataSource<oMantenimientoVehiculo>();
  mantenimientosEdit: oMantenimientoVehiculo | undefined;
  mantenimientoForm: FormGroup;
  alerta: any;

  constructor(){}

  ngAfterViewInit() {
    this.mantenimientosV$.getMantenimientosV().subscribe(
      (res: oMantenimientoVehiculo[]) => {
        this.mantenimiento = res;
        this.dataSource = new MatTableDataSource<oMantenimientoVehiculo>(this.mantenimiento);
        this.dataSource.paginator = this.paginator; // Asignación del paginador
      }
    )
  }

  onPageChange(event): void {
    // Actualiza el índice de la página en el paginador
    this.paginator.pageIndex = event.pageIndex;
  }

  verMantenimientosV(){
    this.mantenimientosV$.getMantenimientosV().subscribe(
      ( res : any ) => {
        this.mantenimiento = res;
      }
    )
  }

  loadData(): void {
    this.mantenimientosV$.getMantenimientosV().subscribe(
      (res: oMantenimientoVehiculo[]) => {
        this.mantenimiento = res;
        if(this.mantenimiento.length != null){
          this.dataSource.data = this.mantenimiento;
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editMantenimientoV(mantenimiento: oMantenimientoVehiculo){
    this.mantenimientosEdit = mantenimiento;

    this.abrirFormulario();

    this.mantenimientoForm.patchValue({
      _id: mantenimiento._id,
      fecha: mantenimiento.fecha,
      codigo: mantenimiento.codigo,
      precio: mantenimiento.precio,
      placa: mantenimiento.placa,
      marca_producto: mantenimiento.marca_producto,
      kilometraje: mantenimiento.kilometraje,
    })
  }

  private inicializarFormulario(): void {
    this.mantenimientoForm = this.fb.group({
      _id: ['', null],
      fecha: [''],
      codigo: [''],
      precio: [''],
      placa: [''],
      marca_producto: [''],
      kilometraje: [''],
   });
  }

  onSubmitEdit(){
    if(this.mantenimientoForm.value){
      const _id: oMantenimientoVehiculo = this.mantenimientoForm.value._id;
      const fecha: oMantenimientoVehiculo = this.mantenimientoForm.value.fecha;
      const mantenimientoEdit: oMantenimientoVehiculo = this.mantenimientoForm.value;
      this.mantenimientosV$.editMantenimientoV(_id, mantenimientoEdit).subscribe(
        async (res:any) => {
          this.verMantenimientosV();
          this.cerrarModal();
          this.alerta = res.alerta;
          await Swal.fire({
            title: 'Listo!',
            text: `${this.alerta}`,
            icon: 'success'
          });
        }
      )
    }
  }


  ngOnInit(): void {
    this.verMantenimientosV();
    this.loadData();
    this.inicializarFormulario();
  }

  getCodigoTexto(codigo: any): string {
    if (codigo === "1") {
      return 'Cambio de Aceite';
    } else if (codigo === "2") {
      return 'Lavado';
    } else {
      return 'Texto por defecto';
    }
  }

  formulario:boolean = false;


    abrirFormulario(){
      this.formulario = true;
    }

    cerrarModal() {
      this.formulario = false;
    }

}

export interface oMantenimientoVehiculo{
  _id?: string;
  fecha: Date;
  codigo: string;
  placa: string;
  precio: string;
  marca_producto: string;
  kilometraje: number;
  alerta?: string;
}
