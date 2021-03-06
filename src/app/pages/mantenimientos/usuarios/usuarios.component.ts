import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService ) { }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }


  ngOnInit(): void {

    this.cargarUsuarios();

    // Nos vemos forzados a retrasar la carga para que pueda mostrar la nueva imagen correctamente.
    // Lo igualamos a this.imgSubs para luego poder destruirlo, para no tener fuga de memoria porque sino se cargará dos veces.
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(500) )
      .subscribe( img => {
        // console.log(img);
        this.cargarUsuarios();
    } );
  }


  cargarUsuarios(){
    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
      .subscribe( ( { total, usuarios } ) => {
        // console.log(resp);
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        // console.log( this.usuarios );
        this.cargando = false;
      } )
  }


  cambiarPagina( valor: number ){
    this.desde += valor;

    if( this.desde < 0 ){
      this.desde = 0;
    }else if( this.desde >= this.totalUsuarios ){
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  
  buscar( termino: string ){

    if(termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }
    // console.log(termino);
    this.busquedasService.buscar( 'usuarios', termino )
      .subscribe( (resp: Usuario[]) => {
        this.usuarios = resp;
      } )
  }


  eliminarUsuario( usuario: Usuario ){
    // console.log(usuario);

    if( usuario.uid === this.usuarioService.uid ){
      return Swal.fire('Error', 'No puede borrarse a si mismo.', 'error');
    }
    // console.log('Esto no se tiene que ver');
    // return;

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire(
        //   'Eliminado!',
        //   'El usuario a sido eliminado.',
        //   'success'
        // )

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe( resp => {
            this.cargarUsuarios();

            Swal.fire(
              'Eliminado!',
              `El usuario ${usuario.nombre} a sido eliminado.`,
              'success'
            );            
          } )
      }
    })

  }

  cambiarRole( usuario: Usuario ){
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
        
      } )
  }

  
  abrirModal( usuario: Usuario ){
    // console.log(usuario);
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img );
  }


}
