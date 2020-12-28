import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() { 
    // console.log('Settings service init');
    // console.log(localStorage.getItem('theme'));
    // Si el localstorage viene vacío, establezco un estilo por defecto.
    const url = localStorage.getItem('theme') || './assets/css/colors/purples-dark.css';
    this.linkTheme.setAttribute('href', url);
    
  }


  changeTheme(theme: string){
    // console.log(theme);
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
  }


  checkCurrentTheme(){

    const links = document.querySelectorAll('.selector');

    links.forEach( elem => {
      elem.classList.remove('working');

      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href'); 

      if( btnThemeUrl === currentTheme ){
        elem.classList.add('working');
      }
    } )
  }
}
