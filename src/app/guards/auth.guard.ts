import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router ){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      console.log('Pasó por el CanActivate del guard');
      
      // this.usuarioService.validarToken()
      //   .subscribe( resp => {
      //     console.log(resp);
          
      //   } )

      // return true;

      return this.usuarioService.validarToken()
        .pipe(
          tap( estaAutenticado => {

            if( !estaAutenticado ){
              this.router.navigateByUrl('/login');
            }
            
          } )
        );
    }
  
}
