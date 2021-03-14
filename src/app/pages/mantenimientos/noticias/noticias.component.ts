import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { NoticiaService } from '../../../services/noticia.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Noticia } from '../../../models/noticia.model';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styles: [
  ]
})
export class NoticiasComponent implements OnInit, OnDestroy {

  public noticias: Noticia[] = [];
  public noticiasTemp: Noticia[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;
  public totalNoticias: number = 0;
  public desde: number = 0;

  constructor( private noticiaService: NoticiaService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {

    this.cargarNoticias();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(500) )
      .subscribe( img => {
        // console.log(img);
        this.cargarNoticias();
    } );
  }

  cargarNoticias(){
    this.cargando = true;

    this.noticiaService.cargarNoticias( this.desde )
      .subscribe( ( { total, noticias } ) => {
        this.cargando = false;
        // console.log(medicos);
        this.totalNoticias = total;
        this.noticias = noticias;
        
      } )
  }


  cambiarPagina( valor: number ){
    this.desde += valor;

    if( this.desde < 0 ){
      this.desde = 0;
    }else if( this.desde >= this.totalNoticias ){
      this.desde -= valor;
    }

    this.cargarNoticias();
  }


  eliminarNoticia( noticia: Noticia ){
    
    Swal.fire({
      title: '¿Borrar la noticia?',
      text: `Está a punto de borrar la noticia: ${noticia.titulo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticiaService.eliminarNoticia(noticia._id)
          .subscribe( resp => {
            this.cargarNoticias();

            Swal.fire(
              'Eliminado!',
              `La noticia ${noticia.titulo} a sido eliminado.`,
              'success'
            );            
          } )
      }
    })
  }


  buscar( termino: string ){

    if(termino.length === 0){
      return this.cargarNoticias();
    }

    this.busquedasService.buscar( 'noticias', termino )
      .subscribe( (resultados:any) => {
        // console.log(resultados);
        this.noticias = resultados;
        
      } )
  }


  abrirModal( noticia: Noticia ){
    this.modalImagenService.abrirModal( 'noticias', noticia._id, noticia.img );
  }

}
