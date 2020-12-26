import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string = 'Título por default';
  // @Input() data1: string = '';

  // Doughnut
  @Input('labels') public doughnutChartLabels: Label[] = ['Label default1', 'Label default2', 'Label default3'];
  @Input('data') public doughnutChartData: MultiDataSet = [
    [100, 100, 100],
  ];

  @Input() public colors: Color[] = [
    {
      backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
    }
  ]

}
