import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Query } from './models/query';

@Injectable()
export class DataService {

    public data = {} as Observable<any>;

    protected basePath = 'http://localhost:3000';
    public defaultHeaders = new HttpHeaders();

    constructor(protected httpClient: HttpClient) {
    }

    public getData(action: string): Observable<any> {
        const headers = this.defaultHeaders;
        return this.httpClient.get<any>(`${this.basePath}/${action}`, {headers});
    }

    public getAllData(): Observable<any> {
        const promises = [];
        Object.keys(Query.queries).forEach(key => {
            const promise: Promise<any> = new Promise(resolve => {
                this.getData(Query.queries[key]).subscribe(res => {
                    if (!!res) {
                        this.data[key] = res;
                        return resolve(res.length);
                    }
                });
            });
            promises.push(promise);
        });
        const promiseResult = Promise.all(promises).then(res => {
            if (!!res) {
                return this.data;
            }
        });
        promiseResult.catch(res => {
            console.log('Terrible error happened', res);
        });
        return from(promiseResult);
    }
}

