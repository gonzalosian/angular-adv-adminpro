import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Bandera para el formulario posteado
  public formSubmitted = false;
  public auth2: any;

  // Validaciones del formulario
  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: [ '', Validators.required ],
    remember: [ localStorage.getItem('remember') || false ]
  })

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login(){
    // this.router.navigateByUrl('/');

    this.formSubmitted = true;
    // console.log( this.loginForm.value );

    if( this.loginForm.invalid ){
      return;
    }

    // Realizar logueo
    this.usuarioService.loginUsuario( this.loginForm.value )
      .subscribe( resp => {
        // console.log('Usuario logueado');
        console.log(resp);

        if( this.loginForm.get('remember').value ){
          localStorage.setItem('email', this.loginForm.get('email').value );
          localStorage.setItem('remember', this.loginForm.get('remember').value );
        }else{
          localStorage.removeItem('email');
          localStorage.removeItem('remember');
        }

        // Navegar al dashboard
        this.router.navigateByUrl('/dashboard');

      }, ( err ) => {
        console.warn( err.error.msg );
        Swal.fire('Error', err.error.msg, 'error');
      } )

  }
  

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp();

  }


  // Las funciones normales modifican el this y las de flecha no, por eso las modificamos
  async startApp() {

    // gapi.load('auth2', () => {
    //   // Retrieve the singleton for the GoogleAuth library and set up the client.
    //   this.auth2 = gapi.auth2.init({
    //     client_id: '226900357334-4a1lrjdjqp20h6smrvt2butb3j4q10h2.apps.googleusercontent.com',
    //     cookiepolicy: 'single_host_origin'
    //   });

    //   this.attachSignin( document.getElementById('my-signin2') );
    
    // });
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin( document.getElementById('my-signin2') );

  };


  attachSignin(element) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          // console.log( id_token );
          this.usuarioService.loginGoogle( id_token )
            .subscribe( resp => {

              this.ngZone.run( () => {
                // Angular pierde el control del ciclo de vida y por eso advierte/recomienda el uso del NgZone,
                // ya que estamos llamando al router desde una funcion externa de Google.
                // Navegar al dashboard
                this.router.navigateByUrl('/dashboard');
              } );
            } );
          
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
