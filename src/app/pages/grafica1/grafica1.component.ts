import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = ['Carne', 'Verdura', 'Pan'];
  public data1 = [
    [100, 150, 200],
  ];

}
