import { Component, OnDestroy } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() { 

    // Si el Observable detecta que no hay nadie subscrito, no trabajará.
    // Para hacer uso del "retry", debemos usar un "pipe". El "retry()" requiere importarlo desde "rxjs/operators"
    
    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subs: ', valor),
    //   error => console.warn('Error: ', error),
    //   () => console.info('Obs terminado')
    // );


    this.intervalSubs = this.retornaIntervalo().subscribe( console.log );

  }

// Siempre es recomendable usar este destructor para aquellos observables que emiten muchos valores.
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.intervalSubs.unsubscribe();
  }


  retornaIntervalo(): Observable<number> {

    return interval(500)
            .pipe(
              take(10),
              map( valor => valor + 1 ),
              filter( valor => ( valor % 2 === 0) ? true : false  ),
            );

    // const intervalo$ = interval(1000)
    //                     .pipe(
    //                       take(4),
    //                       map( valor => {
    //                         return valor + 1;
    //                       } )
    //                     );

    // return intervalo$;
  }


  retornaObservable(): Observable<number> {
    let i = -1;

    // El observer (puede tener otro nombre) es un Subscriber. Es quien estará emitiendo los valores. 
    // Quien dice cuando se termina. Cuando da error. Este Subscriber es quien va a decir como está el Observable y
    // que información está fluyendo a traves de el.
    const obs$ = new Observable<number>( observer => {
      
      const intervalo = setInterval( () => {
        // console.log('tick');
        i++;
        // Necesitamos emitir un valor de retorno para que sea tomado por el callback. 
        // Acá notificamos a los subscritos al observable.
        observer.next(i);
        
        if( i === 4){
          clearInterval(intervalo);
          observer.complete();
        }
        
        if( i === 2){
          // i = -1;
          observer.error('i llegó al valor de 2');
        }

      }, 1000)

    } );

    return obs$;

  }

}
