import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios()
      .then( usuarios => {
        console.log(usuarios);
      } )

    // const promesa = new Promise( ( resolve, reject ) => {
    //   // Las promesas son muy utilizadas cuado queremos realizar tareas que se tienen que ejecutar a destiempo
    //   // o cuando necesitamos ejecutar algo después que alguna tarea suceda o después que algun procedimiento termine.

    //   // Las promesas no son asíncronas por si solas. Para serlo, debe  
    //   if(false){
    //     resolve('Hola mundo');
    //   } else {
    //     reject('Algo salió mal');
    //   }

    // } );

    // // Nos suscribimos para escuchar cuando la promesa se resuelva.
    // promesa
    //   .then( (mensaje) => {
    //     // Este procedimiento es lo que realmente es asíncrono
    //     console.log(mensaje);
    //   } )
    //   .catch( error => console.error('Error en mi promesa: ', error) );

    // console.log('Fin del Init');
    
  }

  getUsuarios(){
    const url = `https://reqres.in/api/users`;

    const promesa = new Promise( resolve => {

      fetch(url)
        .then( resp => resp.json() )
        .then( body => console.log(body.data))

    } );

    return promesa;

  }

}
