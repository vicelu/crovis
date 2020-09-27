import { Injectable } from '@angular/core';
import { Data } from './models/data';

@Injectable()
export class DataModel {
    public static data: Data;
    public static fillModel(data) {
        try {
            this.data = data;
        } catch (e) {
            console.log(e);
        }
    }
}
