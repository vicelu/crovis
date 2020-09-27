import { Podaci } from './podaci';
import { PoDanimaZupanijama, Zupanija } from './po-danima-zupanijama';
import { PoOsobama } from './po-osobama';

export interface Data {
    podaci: Array<Podaci>;
    podaci_zadnji: Array<Podaci>;
    po_danima_zupanijama: Array<PoDanimaZupanijama>;
    po_danima_zupanijama_zadnji: Array<PoDanimaZupanijama>;
    po_osobama: Array<PoOsobama>;
}

export class ZupanijaLatLng {
    constructor(zupanije: Array<Zupanija>) {
    }
}
