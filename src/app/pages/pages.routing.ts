// Archivo creado mediante snipper "ng-route"

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';

const routes: Routes = [
    // Las modificaciones realizadas fueron para que el "dashboard" sea la ruta por defecto, y las rutas
    // hijas quedarán así "dashboard/progress", quedando mas protegidas
    { 
        // path: '', 
        path: 'dashboard', 
        component: PagesComponent,
        children: [
        //   { path: 'dashboard', component: DashboardComponent },
          { path: '', component: DashboardComponent },
          { path: 'progress', component: ProgressComponent },
          { path: 'grafica1', component: Grafica1Component },
        //   { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
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