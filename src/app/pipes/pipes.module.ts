import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { TruncatePipe } from './truncate.pipe';


@NgModule({
  declarations: [
    ImagenPipe,
    TruncatePipe
  ],
  exports: [
    ImagenPipe,
    TruncatePipe
  ],
  // imports: [
  //   CommonModule // no vamos a utilizar directivas de angular como ngif
  // ]
})
export class PipesModule { }
