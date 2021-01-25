import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // Bandera para el formulario posteado
  public formSubmitted = false;

  // Validaciones del formulario
  public registerForm = this.fb.group({
    nombre: [ '', [ Validators.required, Validators.minLength(3) ] ],
    email: [ '', [Validators.required, Validators.email] ],
    password: [ '', Validators.required ],
    password2: [ '', Validators.required ],
    terminos: [ false, Validators.required ],
  }, {
    Validators: this.passwordsIguales( 'password', 'password2' )
  })

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) {}

  
  crearUsuario(){
    this.formSubmitted = true;
    // console.log( this.registerForm.value );

    if( this.registerForm.invalid ){
      return;
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe( resp => {
          console.log('Usuario creado');
          console.log( resp );

          // Navegar al dashboard
          this.router.navigateByUrl('/dashboard');

        }, ( err ) => {
          console.warn( err.error.msg );
          Swal.fire('Error', err.error.msg, 'error');
        } );
    
  }

  campoNoValido( campo: string ):boolean {
    // return true;
    if( this.registerForm.get(campo).invalid && this.formSubmitted ){
      return true;
    }else{
      return false;
    }
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if( pass1 !== pass2 && this.formSubmitted ){
      return true;
    }else{
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted
  }

  passwordsIguales( pass1Name: string, pass2Name: string ){
    // Acá hacemos referencia al formulario
    return ( formGroup: FormGroup ) => {
      
      const pass1Control = formGroup.get( pass1Name );
      const pass2Control = formGroup.get( pass2Name );

      if( pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({ noEsIgual: true })
      }
    }
  }

}
