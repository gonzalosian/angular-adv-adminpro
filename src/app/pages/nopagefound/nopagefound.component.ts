import { Component } from '@angular/core';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: [
  ],
  styleUrls: ['./nopagefound.component.css']
})
export class NopagefoundComponent {

  year = new Date().getFullYear();

}
