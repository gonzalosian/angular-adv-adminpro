import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu(){
    this.menu = JSON.parse( localStorage.getItem('menu') ) || [] ;

    // Se podría validar que si es un arreglo vacío, lo redireccionamos al login.
  }

  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'Gráficas', url: 'grafica1' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Promesas', url: 'promesas' },
  //       { titulo: 'RxJS', url: 'rxjs' },
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Médicos', url: 'medicos' }
  //     ]
  //   }
  // ]

}
