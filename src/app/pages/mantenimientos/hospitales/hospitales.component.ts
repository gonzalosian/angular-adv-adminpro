import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {

    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(500) )
      .subscribe( img => {
        // console.log(img);
        this.cargarHospitales();
    } );
  }


  cargarHospitales(){
    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        this.cargando = false;
        // console.log(hospitales);
        this.hospitales = hospitales;
        
      } )
  }


  guardarCambios( hospital: Hospital ){
    // console.log( hospital );
    const { _id, nombre } = hospital;
    this.hospitalService.actualizarHospital( _id, nombre )
      .subscribe( resp => {
        Swal.fire('Guardado', nombre, 'success');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      } )
  }


  eliminarHospital( hospital: Hospital ){
    // console.log( hospital );
    this.hospitalService.eliminarHospital( hospital._id )
      .subscribe( resp => {
        this.cargarHospitales();
        Swal.fire('Eliminado', hospital.nombre, 'success');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      } )
  }


  buscar( termino: string ){

    if(termino.length === 0){
      return this.cargarHospitales();
    }
    this.busquedasService.buscar( 'hospitales', termino )
      .subscribe( resultados => {
        this.hospitales = resultados;
      } )
  }


  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo Hospital',
      input: 'text',
      // inputLabel: 'Nombre del Hospital',
      inputPlaceholder: 'Nombre Hospital',
      showCancelButton: true,
    })

    // console.log(valor);
    if( value.trim().length > 0 ){
      this.hospitalService.crearHospital( value )
        .subscribe( (resp:any) => {
          // this.cargarHospitales();
          this.hospitales.push( resp.hospital );
          Swal.fire(`Nuevo Hospital: <br> ${ value }`)
        } )
    }
    
    // if (url) {
    //   Swal.fire(`Entered URL: ${url}`)
    // }
  }


  abrirModal( hospital: Hospital ){
    // console.log(usuario);
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

}
