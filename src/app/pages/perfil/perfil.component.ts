import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { FileUploadService } from '../../services/file-upload.service';
import { UsuarioService } from '../../services/usuario.service';

import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = '';

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private fileUploadService: FileUploadService ) {
                 
    this.usuario = usuarioService.usuario;
  }


  ngOnInit(): void {

    this.perfilForm = this.fb.group( {
      nombre: [ this.usuario.nombre , Validators.required],
      email: [ this.usuario.email, [Validators.required, Validators.email]],
    } );

  }


  actualizarPerfil(){
    console.log( this.perfilForm.value );
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe( resp => {
        // console.log(resp);
        // Acá podemos hacerlo de dos forma: tomar los valores del formulario o tomar lo que viene de la respuesta,
        // todo dependiendo como se haya hecho el backend
        const { nombre, email } = this.perfilForm.value;

        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Perfil actualizado', 'success');
        
      }, (err) =>{
        // console.warn( err.error.msg );
        Swal.fire('Error', err.error.msg, 'error');
      } );
  }


  cambiarImagen( file: File ){
    // console.log( file );
    this.imagenSubir = file;

    if( !file ){
      return this.imgTemp = null ;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onload = () => {
      // console.log( reader.result );
      this.imgTemp = reader.result;
    }
  }


  subirImagen(){
    this.fileUploadService.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
      .then( img => {
        // console.log( img );
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
      } )
      .catch( err => {
        console.error(err);
        Swal.fire('Error', 'No se puede subir la imagen', 'error');
      } );
  }

}
