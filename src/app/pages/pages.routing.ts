// Archivo creado mediante snipper "ng-route"

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';


const routes: Routes = [
    // Las modificaciones realizadas fueron para que el "dashboard" sea la ruta por defecto, y las rutas
    // hijas quedarán así "dashboard/progress", quedando mas protegidas
    { 
        // path: '', 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ], // aquí protegemos nuestras rutas
        // Si hay carga perezosa, debe estar el canLoad
        canLoad: [ AuthGuard ], // Nos asegura que la ruta se pueda cargar antes de hacer otra cosa.
        // Carga perezosa
        loadChildren: () => import('./child-routes.module').then( m => m.ChildRoutesModule )
    }

    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
