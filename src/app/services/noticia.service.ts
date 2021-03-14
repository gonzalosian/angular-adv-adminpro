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

  cargarNoticias( desde: number = 0 ){
    //http://localhost:3005/api/hospitales

    // const url = `${ base_url }/noticias`;
    const url = `${ base_url }/noticias?desde=${ desde }`;
    
    // A diferencia del servicio usuario, este lo crearemos así para evitar
    // crear instancias y mediante un pipe, poder mostrar la imagen.
    return this.http.get( url, this.header )
      .pipe(
        map( (resp: {ok: boolean, noticias: Noticia[], total }) => {
          
          // resp.noticias
          return {
            total: resp.total,
            noticias: resp.noticias
          };
        } )
      )
  }

  obtenerNoticiaById( id: string ){
    //http://localhost:3005/api/medicos/5fffa0ad8235b846e4fa8847
    const url = `${ base_url }/noticias/${id}`;
    
    return this.http.get( url, this.header )
      .pipe(
        map( (resp: {ok: boolean, noticia: Noticia }) => resp.noticia )
      )
  }

  crearNoticia( noticia: {titulo: string, subtitulo: string, descripcion: string} ){
    const url = `${ base_url }/noticias`;
    
    return this.http.post( url, noticia, this.header );
  }
  // crearNoticia( titulo: string ){
  //   const url = `${ base_url }/noticias`;
    
  //   return this.http.post( url, {titulo}, this.header );
  // }

  actualizarNoticia( noticia: Noticia ){
    const url = `${ base_url }/noticias/${noticia._id}`;
    
    return this.http.put( url, noticia, this.header );
  }
  // actualizarNoticia( _id: string , titulo: string ){
  //   const url = `${ base_url }/noticias/${_id}`;
    
  //   return this.http.put( url, {titulo}, this.header );
  // }

  eliminarNoticia( _id: string ){
    const url = `${ base_url }/noticias/${_id}`;
    
    return this.http.delete( url, this.header );
  }

}
