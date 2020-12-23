import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common'; Lo borro porque no utilizaremos acá el ngFor y demás...
// Importamos el módulo del Router
import { RouterModule, Routes } from '@angular/router';

// Módulos
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';

//Configuramos las rutas de la aplicación
const routes: Routes = [

  // path: '/dashboard' PagesRouting
  // path: '/auth' AuthRouting

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Esta será nuestra ruta por defecto.
  { path: '**', component: NopagefoundComponent }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot( routes ),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
