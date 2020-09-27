export interface PoDanimaZupanijama {
    Datum: string;
    PodaciDetaljno: Array<PodaciDetaljno>;
}

export interface PodaciDetaljno {
    Zupanija: Zupanija;
    broj_aktivni: number;
    broj_umrlih: number;
    broj_zarazenih: number;
}

export enum Zupanija {
    'Bjelovarsko-bilogorska',
    'Brodsko-posavska',
    'Dubrovačko-neretvanska',
    'Grad Zagreb',
    'Istarska',
    'Karlovačka',
    'Koprivničko-križevačka',
    'Krapinsko-zagorska županija',
    'Ličko-senjska',
    'Međimurska',
    'Osječko-baranjska',
    'Požeško-slavonska',
    'Primorsko-goranska',
    'Sisačko-moslavačka',
    'Splitsko-dalmatinska',
    'Šibensko-kninska',
    'Varaždinska',
    'Virovitičko-podravska',
    'Vukovarsko-srijemska',
    'Zadarska',
    'Zagrebačka'
}
