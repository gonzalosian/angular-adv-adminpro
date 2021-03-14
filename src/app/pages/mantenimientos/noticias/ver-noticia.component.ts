import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { NoticiaService } from '../../../services/noticia.service';
import { Noticia } from '../../../models/noticia.model';

@Component({
  selector: 'app-ver-noticia',
  templateUrl: './ver-noticia.component.html',
  styles: [
  ]
})
export class VerNoticiaComponent implements OnInit {

  public noticiaSeleccionada: Noticia;

  constructor( private activatedRoute: ActivatedRoute,
               private noticiaService: NoticiaService,
               private router: Router ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      //console.log( params );
      this.cargarNoticia( id );
    } )

  }


  cargarNoticia( id: string ){

    this.noticiaService.obtenerNoticiaById( id )
       .pipe(
         delay(100) // 100 ms imperceptible para el usuario
       )
       .subscribe( noticia => {
        //  console.log(noticia);

        if( !noticia ){ // Si el médico no existe o lo inventaron, lo sacamos.
          return this.router.navigateByUrl(`/dashboard`);
        }

         this.noticiaSeleccionada = noticia;
       })

  }

}
