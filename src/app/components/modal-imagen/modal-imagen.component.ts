import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  constructor( public modalImagenService: ModalImagenService,
               private fileUploadService: FileUploadService ) { }

  public imagenSubir: File;
  public imgTemp: any = '';

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto( this.imagenSubir, tipo, id )
      .then( img => {
        // console.log( img );
        Swal.fire('Guardado', 'Imagen actualizada', 'success');

        this.modalImagenService.nuevaImagen.emit( img );

        this.cerrarModal();
      } )
      .catch( err => {
        console.error(err);
        Swal.fire('Error', 'No se puede subir la imagen', 'error');
      } );
  }

}