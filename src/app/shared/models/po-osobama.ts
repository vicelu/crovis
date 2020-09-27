import { Zupanija } from './po-danima-zupanijama';

export interface PoOsobama {
    Datum: string;
    Zupanija: Zupanija;
    dob: number;
    spol: Spol;
}

export enum Spol {
    'M',
    'Ž'
}
