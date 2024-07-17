import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { VehiculosComponent } from './pages/vehiculos/vehiculos.component';
import { MantenimientoVComponent } from './pages/mantenimiento-v/mantenimiento-v.component';
import { MantenimientosComponent } from './pages/mantenimientos/mantenimientos.component';
import { MainDashboardComponent } from './pages/main-dashboard/main-dashboard.component';
import { CambioAComponent } from './components/mantenimientos/cambio-a/cambio-a.component';

export const routes: Routes = [
  {path: 'inicio', component: InicioComponent,
    children: [
      {path: 'dashboard', component: MainDashboardComponent},
      {path: 'vehiculos', component: VehiculosComponent},
      {path: 'mantenimientos', component: MantenimientosComponent},
      {path: 'cambio/:id', component: CambioAComponent},
      {path: '**', pathMatch:'full', redirectTo: 'vehiculos'},
      ]
    },


    {path: '**', pathMatch:'full', redirectTo: 'inicio'}
];
