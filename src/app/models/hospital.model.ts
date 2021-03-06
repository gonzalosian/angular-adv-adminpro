// Por convención, el guión bajo da señal que es privado, pero lo único que lo hace
// privado es que no se está exportando.
interface _HospitalUser {
    _id: string,
    nombre: string,
    img: string
}


// Cuando usar interfaces y cuando clases: cuando hay metodos, será una clase.
export class Hospital {

    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _HospitalUser,
    ){}

}