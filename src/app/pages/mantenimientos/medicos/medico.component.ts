import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit, OnDestroy {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;
  public paramsSubs: Subscription;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.paramsSubs.unsubscribe();
  }

  ngOnInit(): void {

    // Hay muchas formas de obtener el id del médico, pero necesito manejarlo con una suscripcion porque puedo
    // estar en la misma pantalla y ese url puede cambiar. Puedo hacerlo por el snapshot, pero este no cambia una vez leido.
    this.paramsSubs = this.activatedRoute.params.subscribe( ({id}) => { // el nombre que le pusimos en el routing, es el mismo que debemos poner en el params.
      //console.log( params );
      this.cargarMedico( id );
      // console.log('tick'); // verificamos si tenemos 2 o mas tick, o sea, fuga de memoria.
    } )
    
    this.medicoForm = this.fb.group({
      nombre: [ '', Validators.required ],
      hospital: [ '', Validators.required ],
    })

    this.cargarHospitales();

    // Gracias a estar usando formularios reactivos, podemos crear un observable que esté pendiente
    // del hospital seleccionado
    this.medicoForm.get('hospital').valueChanges
      .subscribe( hospitalId => {
        // console.log(hospitalId);
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
        // console.log( this.hospitalSeleccionado );
      } )
  }


  cargarMedico( id: string ){

    if( id === 'nuevo' ){
      return;
    }

     this.medicoService.obtenerMedicoById( id )
       .pipe(
         delay(100) // 100 ms imperceptible para el usuario
       )
       .subscribe( medico => {
        //  console.log(medico);

        if( !medico ){ // Si el médico no existe o lo inventaron, lo sacamos.
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }

         const { nombre, hospital:{ _id } } = medico;
         this.medicoSeleccionado = medico;
         // completamos el Form Group
         this.medicoForm.setValue( { nombre, hospital: _id } )
       })
  }


  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        // console.log(hospitales);
        this.hospitales = hospitales;
      } )
  }


  guardarMedico(){

    const { nombre } = this.medicoForm.value;

    if( this.medicoSeleccionado ){
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      // console.log( data );

      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {
          Swal.fire('Médico actualizado', `${nombre} actualizado correctamente`, 'success' );
        } )
    } else {
      // crear
      // console.log(this.medicoForm.value);
      this.medicoService.crearMedico( this.medicoForm.value )
        .subscribe( (resp: any) => {
          // console.log(resp);
          Swal.fire('Médico guardado', `${nombre} creado correctamente`, 'success' );
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
        } )
    }

  }


  abrirModal( medico: Medico ){
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );    
  }

}
