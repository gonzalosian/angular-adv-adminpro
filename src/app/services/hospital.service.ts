import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  // public hospitales: Hospital;

  constructor( private http: HttpClient ) { 
  }

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

  cargarHospitales(){
    //http://localhost:3005/api/hospitales
    const url = `${ base_url }/hospitales`;
    // A diferencia del servicio usuario, este lo crearemos así para evitar
    // crear instancias y mediante un pipe, poder mostrar la imagen.
    return this.http.get( url, this.header )
      .pipe(
        map( (resp: {ok: boolean, hospitales: Hospital[] }) => resp.hospitales )
      )
  }

  crearHospital( nombre: string ){
    const url = `${ base_url }/hospitales`;
    
    return this.http.post( url, {nombre}, this.header );
  }

  actualizarHospital( _id: string , nombre: string ){
    const url = `${ base_url }/hospitales/${_id}`;
    
    return this.http.put( url, {nombre}, this.header );
  }

  eliminarHospital( _id: string ){
    const url = `${ base_url }/hospitales/${_id}`;
    
    return this.http.delete( url, this.header );
  }

}
