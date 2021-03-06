import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos(){
    //http://localhost:3005/api/hospitales
    const url = `${ base_url }/medicos`;
    // A diferencia del servicio usuario, este lo crearemos así para evitar
    // crear instancias y mediante un pipe, poder mostrar la imagen.
    return this.http.get( url, this.header )
      .pipe(
        map( (resp: {ok: boolean, medicos: Medico[] }) => resp.medicos )
      )
  }


  obtenerMedicoById( id: string ){
    //http://localhost:3005/api/medicos/5fffa0ad8235b846e4fa8847
    const url = `${ base_url }/medicos/${id}`;
    
    return this.http.get( url, this.header )
      .pipe(
        map( (resp: {ok: boolean, medico: Medico }) => resp.medico )
      )
  }

  // crearMedico( medico: Medico ){ al hacerlo así, si o si debe estar el objeto completo. 
  // En el otro caso, al menos los campos señalados
  crearMedico( medico: {nombre: string, hospital: string} ){
    const url = `${ base_url }/medicos`;
    
    return this.http.post( url, medico, this.header );
  }

  actualizarMedico( medico: Medico ){
    const url = `${ base_url }/medicos/${medico._id}`;
    
    return this.http.put( url, medico, this.header );
  }

  eliminarMedico( _id: string ){
    const url = `${ base_url }/medicos/${_id}`;
    
    return this.http.delete( url, this.header );
  }
}
