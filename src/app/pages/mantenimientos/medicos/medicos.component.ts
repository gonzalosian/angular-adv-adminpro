import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Medico } from '../../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {

    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(500) )
      .subscribe( img => {
        // console.log(img);
        this.cargarMedicos();
    } );
  }

  cargarMedicos(){
    this.cargando = true;

    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        // console.log(medicos);
        this.medicos = medicos;
        
      } )
  }


  eliminarMedico( medico: Medico ){
    // console.log( hospital );
    // this.medicoService.eliminarMedico( medico._id )
    //   .subscribe( resp => {
    //     this.cargarMedicos();
    //     Swal.fire('Eliminado', medico.nombre, 'success');
    //   }, (err) => {
    //     Swal.fire('Error', err.error.msg, 'error');
    //   } )

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id)
          .subscribe( resp => {
            this.cargarMedicos();

            Swal.fire(
              'Eliminado!',
              `El médico ${medico.nombre} a sido eliminado.`,
              'success'
            );            
          } )
      }
    })
  }


  buscar( termino: string ){

    if(termino.length === 0){
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino )
      .subscribe( resultados => {
        this.medicos = resultados;
      } )
  }


  // async abrirSweetAlert(){
  //   const {value = ''} = await Swal.fire<string>({
  //     title: 'Crear Médico',
  //     text: 'Ingrese el nombre del nuevo Médico',
  //     input: 'text',
  //     // inputLabel: 'Nombre del Hospital',
  //     inputPlaceholder: 'Nombre Médico',
  //     showCancelButton: true,
  //   })

  //   // console.log(valor);
  //   if( value.trim().length > 0 ){
  //     this.medicoService.crearMedico( value )
  //       .subscribe( (resp:any) => {
  //         // this.cargarHospitales();
  //         this.medicos.push( resp.medico );
  //         Swal.fire(`Nuevo Médico: <br> ${ value }`)
  //       } )
  //   }
  // }


  abrirModal( medico: Medico ){
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
  }

}
