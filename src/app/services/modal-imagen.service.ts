import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultrarModal: boolean = true;
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id: string;
  public img: string;
  // emitiremos un valor cuando la imagen cambie
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultrarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string = 'no-img')
  {
    this._ocultrarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;

    console.log(img);
    

    //http://localhost:3005/api/upload/usuarios/xczxczx.jpg
    if( img.includes('https') ){
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${ tipo }/${ img }`;
    }

  }

  cerrarModal(){
    this._ocultrarModal = true;
  }

  constructor() { }
}
