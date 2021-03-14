import { Component, OnInit } from '@angular/core';
// import { Noticia } from 'src/app/models/noticia.model';
import { Noticia } from '../../models/noticia.model';
import { NoticiaService } from '../../services/noticia.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public noticias: Noticia[] = [];
  public cargando: boolean = true;

  constructor( private noticiaService: NoticiaService ) { }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias(){
    this.cargando = true;

    this.noticiaService.cargarNoticias()
      .subscribe( res => {
        this.cargando = false;
        // console.log(noticias);
        this.noticias = res.noticias;
      } )
  }

}
