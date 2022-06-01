import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScorePack } from '@app/../../../common/model/score-pack';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ScoreBoardService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    getClassic(): Observable<ScorePack[]> {
        return this.http.get<ScorePack[]>(`${this.baseUrl}/scores/classic`).pipe(catchError(this.handleError<ScorePack[]>('fetchClassic')));
    }

    getLog(): Observable<ScorePack[]> {
        return this.http.get<ScorePack[]>(`${this.baseUrl}/scores/log2990`).pipe(catchError(this.handleError<ScorePack[]>('fetchLog')));
    }

    private handleError<T>(_request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
