import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { NoticiaService } from '../../../services/noticia.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Noticia } from '../../../models/noticia.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styles: [
  ]
})
export class NoticiaComponent implements OnInit, OnDestroy {

  public noticiaForm: FormGroup;
  public noticiaSeleccionado: Noticia;
  public paramsSubs: Subscription;

  constructor( private fb: FormBuilder,
              private noticiaService: NoticiaService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.paramsSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.paramsSubs = this.activatedRoute.params.subscribe( ({id}) => { // el nombre que le pusimos en el routing, es el mismo que debemos poner en el params.
      //console.log( params );
      this.cargarNoticia( id );
      // console.log('tick'); // verificamos si tenemos 2 o mas tick, o sea, fuga de memoria.
    } )
    
    this.noticiaForm = this.fb.group({
      titulo: [ '', Validators.required ],
      subtitulo: [ '', Validators.required ],
      descripcion: [ '', Validators.required ],
    })

  }


  cargarNoticia( id: string ){

    if( id === 'nuevo' ){
      return;
    }

     this.noticiaService.obtenerNoticiaById( id )
       .pipe(
         delay(100) // 100 ms imperceptible para el usuario
       )
       .subscribe( noticia => {
        //  console.log(noticia);

        if( !noticia ){ // Si el médico no existe o lo inventaron, lo sacamos.
          return this.router.navigateByUrl(`/dashboard/noticias`);
        }

         const { titulo, subtitulo, descripcion } = noticia;

         this.noticiaSeleccionado = noticia;
         // completamos el Form Group
         this.noticiaForm.setValue( { titulo, subtitulo, descripcion } )
       })
  }


  guardarNoticia(){

    const { titulo } = this.noticiaForm.value;

    if( this.noticiaSeleccionado ){
      // actualizar
      const data = {
        ...this.noticiaForm.value,
        _id: this.noticiaSeleccionado._id
      }
      // console.log( data );

      this.noticiaService.actualizarNoticia( data )
        .subscribe( resp => {
          Swal.fire('Noticia actualizada', `${titulo} - Actualizada correctamente`, 'success' );
        } )
    } else {
      // crear
      // console.log(this.noticiaForm.value);
      this.noticiaService.crearNoticia( this.noticiaForm.value )
        .subscribe( (resp:any) => {
          // console.log(resp);
          Swal.fire('Noticia guardada', `${titulo} - Creada correctamente`, 'success' );
          this.router.navigateByUrl(`/dashboard/noticia/${ resp.noticia._id }`)
        } )
    }
  }


  abrirModal( noticia: Noticia ){
    this.modalImagenService.abrirModal( 'noticias', noticia._id, noticia.img );    
  }

}
