import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Gracias a que las peticiones son observable, podemos concatenarle un pipe que pase por algun procedimiento
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'; // Disparará un efecto secundario

import { environment } from '../../environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interfaces';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) { 

    // En Angular, los servicios son Singleton, o sea, solo habrá una instancia
    this.googleInit();
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


  logout(){
    localStorage.removeItem('token');
    
    this.auth2.signOut().then( () => {
      
      // Respondiendo a la advertencia de Angular: 
      // Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?
      this.ngZone.run( () => {

        console.log('User signed out.');
        this.router.navigateByUrl('/login');
      } )

    });
  }

  
  validarToken(): Observable<boolean> {
    // Este servicios lo utilizaremos en el auth.guard
    const token  = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
        // esto siempre devolverá un observable
        tap( (resp: any) => {
          // console.log(resp);
          localStorage.setItem('token', resp.token);
        } ),
        map( resp => true ),
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
                          localStorage.setItem('token', resp.token);
                        } )
                      );
  }
  

  loginUsuario( formData: LoginForm ){
    return this.http.post(`${base_url}/login`, formData)
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token);
                        } )
                      );
  }


  loginGoogle( token ){
    return this.http.post(`${base_url}/login/google`, {token} )
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token);
                        } )
                      );
  }

}
