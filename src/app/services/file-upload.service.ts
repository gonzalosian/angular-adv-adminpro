import { Injectable } from '@angular/core';
// import { async } from '@angular/core/testing';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales' | 'noticias',
    id: string
  ){

    try {
      // http://localhost:3005/api/upload/usuarios/5ffeed50e0d08e25a46dac1b
      const url = `${base_url}/upload/${ tipo }/${ id }`;
      // Preparamos la data. Manera de poder enviar info al backend mediante la petición fetch
      const formData = new FormData();
      // hacemos el append de lo que necesitamos del body
      formData.append('imagen', archivo);

      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      } );

      const data = await resp.json();
      // console.log( data ); // esta data proviene de la respuesta del backend

      if( data.ok ){
        return data.nombreArchivo;
      }else{
        console.error( data.msg );
        return false;
      }
      
    } catch (error) {
      console.error(error);
      return false;
    }

  }
}
