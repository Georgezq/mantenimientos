import { Component, inject, OnInit } from '@angular/core';
import { VehiculosService } from '../../services/vehiculos.service';
import { RouterLink } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { AutoDefaultDirective } from '../../directives/auto-default.directive';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Storage,ref, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { CambioAComponent } from '../../components/mantenimientos/cambio-a/cambio-a.component';
import { ModalService } from '../../services/modal.service';
import { LavadoComponent } from '../../components/mantenimientos/lavado/lavado.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CambioAComponent, LavadoComponent ,FormsModule, RouterLink, DatePipe, AutoDefaultDirective, NgIf, ReactiveFormsModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.css',
})
export class VehiculosComponent implements OnInit{

  isLoading = true;
  search: string = '';
  vehiculoAPI: oVehiculos[] = [];
  vehiculoEdit: oVehiculos | undefined;
  fileRef:any;
  uploadProgress$!: Observable<number>;
  downloadURL$!: Observable<string>;
  cargandoFoto: boolean = false;
  textfile: string;
  url: string = 'https://firebasestorage.googleapis.com/v0/b/gf-pro.appspot.com/o/archivos%2Fgatopana.jpg?alt=media&token=bd1702f6-d5f9-4c0a-8d1b-848e4118beb8';



  vehiculosAdd: FormGroup;
  private vehiculos$ = inject(VehiculosService);
  private storage: Storage = inject(Storage);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);

  ngOnInit() {
    this.loadVehiculos();
  }

  constructor() {
    this.mostrarVehiculos();
    this.inicializarFormulario();
  }

  mostrarVehiculos(){
    this.vehiculos$.getVehiculos().subscribe(
      (res: any) => {
        this.vehiculoAPI = res;
      }
    );
  }

  loadVehiculos() {
    this.isLoading = true;
    this.vehiculos$.filtrarVehiculos(this.search).subscribe(
      (data) => {
        this.vehiculoAPI = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar vehículos', error);
        this.isLoading = false;
      }
    );
  }

  onSearch() {
    this.loadVehiculos();
  }

  async onFileSelected(event: any) {
    const archivoSeleccionado: File = event.target.files[0];
    this.uploadFile(archivoSeleccionado);
    this.textfile = archivoSeleccionado.name;
  }

  async uploadFile(file: File) {
    this.cargandoFoto = true;
    const filePath = `archivos/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Puedes manejar el progreso de carga aquí si lo necesitas
      },
      (error) => {
        console.error('Error al cargar el archivo:', error);
        this.cargandoFoto = false;
      },
      async () => {
        this.cargandoFoto = false;
        this.url = await getDownloadURL(fileRef);
        this.vehiculosAdd.patchValue({
          imagen: this.url // Asigna la URL al campo img_ref del formulario
        });
      }
    );
  }

  private inicializarFormulario(): void {
    this.vehiculosAdd = this.fb.group({
      _id: ['', null],
      placa: [''],
      marca: [''],
      modelo: [''],
      imagen: [''],
      anio: [''],
   });
  }

  onSubmit() {
    const carData: oVehiculos = {
      imagen: this.vehiculosAdd.value.imagen,
      marca: this.vehiculosAdd.value.marca,
      modelo: this.vehiculosAdd.value.modelo,
      placa: this.vehiculosAdd.value.placa,
      anio: this.vehiculosAdd.value.anio,
    };

    this.vehiculos$.addVehiculos(carData).subscribe(
      async () => {
        this.mostrarVehiculos();
        this.cerrarModal();
        await Swal.fire({
          title: 'Listo!',
          text: 'Ingresado correctamente',
          icon: 'success'
        });
      }
    );
  }

  editVehiculos(vehiculo: oVehiculos){
    this.vehiculoEdit = vehiculo;

    this.abrirFormularioEdit();

    this.vehiculosAdd.patchValue({
      _id: vehiculo._id,
      imagen: vehiculo.imagen,
      modelo: vehiculo.modelo,
      marca: vehiculo.marca,
      placa: vehiculo.placa,
      anio: vehiculo.anio,
    });
  }

  onSubmitEdit(){
    if(this.vehiculosAdd.value){
      const _id: oVehiculos = this.vehiculosAdd.value._id;
      const vehiculoEdit: oVehiculos = this.vehiculosAdd.value;
      this.vehiculos$.editVehiculo(_id, vehiculoEdit).subscribe(
        async () => {
          this.mostrarVehiculos();
          this.cerrarModalEdit();
          await Swal.fire({
            title: 'Listo!',
            text: 'Editado correctamente',
            icon: 'success'
          });
        }
      )
    }
  }

  deleteVehiculo(id:any){
    Swal.fire({
      title: 'Quieres eliminar este vehiculo?',
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if(result.isConfirmed) {
        this.vehiculos$.deleteVehiculos(id).subscribe(
          (res) => {
            Swal.fire("Eliminado!", "", "success");
            this.mostrarVehiculos();
          }
        )
      } else if(result.isDenied){
        Swal.fire("Eliminación cancelada", "", "info");
      }
    });
  }

  onLoad() {
    this.isLoading = false;
  }

  //FUNCIONAMIENTO DEL MODAL

  formulario:boolean = false;
  formularioEdit:boolean = false;
  formularioCa: boolean;
  mostrarCambio: boolean = false;
  mostrarlavado: boolean = false;
  placaV: any;

  abrirFormulario(){
      this.formulario = true;
      this.vehiculosAdd.reset();
  }

  cerrarModal() {
    this.formulario = false;
  }

  abrirFormularioEdit(){
      this.formularioEdit = true;
  }

  cerrarModalEdit() {
    this.formularioEdit = false;
  }

  mostrarCambioAceite(placa:any) {
    this.mostrarCambio = true;
    this.modalService.mostrarModalCambioA(placa);
  }

  mostrarLavado(placa:any) {
    this.mostrarlavado = true;
    this.modalService.mostrarModalLavado(placa);
  }


}

export interface oVehiculos{
  _id?: string;
  imagen: string;
  marca: string;
  modelo: string;
  placa: string;
  anio: number;
}
