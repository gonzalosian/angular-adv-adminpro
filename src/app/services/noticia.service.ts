import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Noticia } from '../models/noticia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  
  get header() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarNoticias(){
    //http://localhost:3005/api/hospitales
    const url = `${ base_url }/noticias`;
    // A diferencia del servicio usuario, este lo crearemos así para evitar
    // crear instancias y mediante un pipe, poder mostrar la imagen.
    return this.http.get( url, this.header )
      .pipe(
        map( (resp: {ok: boolean, noticias: Noticia[] }) => resp.noticias )
      )
  }

  crearNoticia( titulo: string ){
    const url = `${ base_url }/noticias`;
    
    return this.http.post( url, {titulo}, this.header );
  }

  actualizarNoticia( _id: string , titulo: string ){
    const url = `${ base_url }/noticias/${_id}`;
    
    return this.http.put( url, {titulo}, this.header );
  }

  eliminarNoticia( _id: string ){
    const url = `${ base_url }/noticias/${_id}`;
    
    return this.http.delete( url, this.header );
  }

}
