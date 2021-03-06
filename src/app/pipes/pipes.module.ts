import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [
    ImagenPipe
  ],
  exports: [
    ImagenPipe
  ],
  // imports: [
  //   CommonModule // no vamos a utilizar directivas de angular como ngif
  // ]
})
export class PipesModule { }
