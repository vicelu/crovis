import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Query } from './models/query';
import { Data } from './models/data';

@Injectable()
export class DataService {

    public data = {} as Data;

    protected basePath = 'http://localhost:3000';
    public defaultHeaders = new HttpHeaders();

    constructor(protected httpClient: HttpClient) {
    }

    public getData(action: string): Observable<any> {
        const headers = this.defaultHeaders;
        return this.httpClient.get<any>(`${this.basePath}/${action}`, {headers});
    }

    public getZupanijeGeoJson(): Observable<any> {
        return this.getData('zupanije-geo-json');
    }

    public getAllData(): Observable<any> {
        const promises = [];
        Object.keys(Query.queries).forEach(key => {
            const promise: Promise<any> = new Promise(resolve => {
                this.getData(Query.queries[key]).subscribe(res => {
                    if (!!res) {
                        this.data[key] = res;
                        return resolve();
                    }
                });
            });
            promises.push(promise);
        });
        const geoJsonPromise: Promise<any> = new Promise(resolve => {
            this.getZupanijeGeoJson().subscribe(res => {
                if (!!res) {
                    this.data.zupanije_geo_json = res;
                    return resolve();
                }
            });
        });
        promises.push(geoJsonPromise);
        const promiseResult = Promise.all(promises).then(res => {
            if (res) {
                return this.data;
            }
        });
        promiseResult.catch(res => {
            console.log('Terrible error happened', res);
        });
        return from(promiseResult);
    }
}

