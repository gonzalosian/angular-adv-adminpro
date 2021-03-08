import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  // public imgUrl = '';
  public usuario: Usuario;

  constructor( private usuarioService: UsuarioService,
               private router: Router ) { 
    // Como es un get, no necesitamos las llaves en imagenUrl
    // this.imgUrl = usuarioService.usuario.imagenUrl;
    this.usuario = usuarioService.usuario;

    // console.log( this.usuario );
  }

  buscar( termino: string ){
    // console.log(termino);
    if( termino.length === 0 ){
      // this.router.navigateByUrl(`/dashboard`);
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
    
  }


  logout(){
    this.usuarioService.logout();
  }

}
