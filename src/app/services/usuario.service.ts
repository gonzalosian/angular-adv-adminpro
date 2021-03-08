import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Gracias a que las peticiones son observable, podemos concatenarle un pipe que pase por algun procedimiento
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators'; // Disparará un efecto secundario

import { environment } from '../../environments/environment';
// Interfaces
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';
// import { url } from 'inspector';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) { 

    // En Angular, los servicios son Singleton, o sea, solo habrá una instancia
    this.googleInit();
  }


  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get header() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  googleInit(){

    return new Promise( (resolve: any) => {

      // Aunque nadie esté escuchando el .then, siempre se está disparando el 'google init', a diferencia
      // de los Observable que alguien tiene que estar escuchando. Las promesas siempre se van a ejecutar.
      // console.log('Google init');
      
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '226900357334-4a1lrjdjqp20h6smrvt2butb3j4q10h2.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        // El resolve lo llamamos una vez inicializado todo el código
        resolve();
      });
      
    } )

  }


  guardarLocalStorage( token: string, menu: any ){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu)); // solo podemos grabar string
  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    
    this.auth2.signOut().then( () => {
      
      // Respondiendo a la advertencia de Angular: 
      // Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?
      this.ngZone.run( () => {

        // console.log('User signed out.');
        this.router.navigateByUrl('/login');
      } )

    });
  }

  
  validarToken(): Observable<boolean> {
    // Este servicios lo utilizaremos en el auth.guard
    // const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, this.header).pipe(
        // esto siempre devolverá un observable
        map( (resp: any) => {
          // console.log(resp);
          const { email, google, img = '', nombre, role, uid } = resp.usuario;
          this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
          // this.usuario.imprimirUsuario();

          // localStorage.setItem('token', resp.token);
          // localStorage.setItem('menu', resp.menu);
          this.guardarLocalStorage( resp.token, resp.menu );

          return true;
        } ),
        // map( resp => true ),
        // of va a crear/retornar un nuevo observable con base al valor que le pasemos, sin romper el ciclo.
        catchError( error => of(false) )
      );
  }


  crearUsuario( formData: RegisterForm ){
    // Esto devuelve una promosa a la cual nos suscribiremos en el register
    return this.http.post(`${base_url}/usuarios`, formData)
                      .pipe(
                        // esto siempre devolverá un observable
                        tap( (resp: any) => {
                          // console.log(resp);
                          // localStorage.setItem('token', resp.token);
                          // localStorage.setItem('menu', resp.menu);
                          this.guardarLocalStorage( resp.token, resp.menu );
                        } )
                      );
  }

// No utilizamos una interface para ver otra forma de resolver
  actualizarPerfil( data: { email: string, nombre: string, role: string } ){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.header);
  }
  

  loginUsuario( formData: LoginForm ){
    return this.http.post(`${base_url}/login`, formData)
                      .pipe(
                        tap( (resp: any) => {
                          // localStorage.setItem('token', resp.token);
                          // localStorage.setItem('menu', resp.menu);
                          this.guardarLocalStorage( resp.token, resp.menu );
                        } )
                      );
  }


  loginGoogle( token ){
    return this.http.post(`${base_url}/login/google`, {token} )
                      .pipe(
                        tap( (resp: any) => {
                          // localStorage.setItem('token', resp.token);
                          // localStorage.setItem('menu', resp.menu);
                          this.guardarLocalStorage( resp.token, resp.menu );
                        } )
                      );
  }


  cargarUsuarios( desde: number = 0 ){
    // http://localhost:3005/api/usuarios?desde=0
    const url = `${ base_url }/usuarios?desde=${ desde }`;

    // Se podría hacer así, pero conviene hacer una interface
    // return this.http.get<{ total: Number, usuarios: Usuario[] }>( url, this.header );
    return this.http.get<CargarUsuario>( url, this.header )
      .pipe(
        // delay(5000),
        map( resp => {
          // console.log(resp);
          // cambiar el arreglo de objetos por un arreglo de tipo usuario
          // resp.usuarios sé que es un listado, que puedo pasarlo por un map() para transformar arreglo y devolver uno diferente
          const usuarios = resp.usuarios.map( 
            user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid ) 
          );
          
          // return resp;
          return {
            total: resp.total,
            usuarios
          };
        } )
      )
  }

  eliminarUsuario( usuario: Usuario ){
    // console.log('eliminado');
    //http://localhost:3005/api/usuarios/600555ba42c5543e686b2e5b
    const url = `${ base_url }/usuarios/${ usuario.uid }`;

    return this.http.delete( url, this.header )
  }


  guardarUsuario( usuario: Usuario ){
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.header);
  }

}
