import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameLog } from '@app/../../../common/model/game-log';
import { ScorePack } from '@app/../../../common/model/score-pack';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { UsernameValidationService } from '@app/services/username-validation/username-validation.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AdminDatabaseLinkService {
    expertPlayers: BehaviorSubject<VirtualPlayerInfo[]> = new BehaviorSubject<VirtualPlayerInfo[]>([]);
    beginnerPlayers: BehaviorSubject<VirtualPlayerInfo[]> = new BehaviorSubject<VirtualPlayerInfo[]>([]);
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient, private readonly usernameValidationService: UsernameValidationService) {}

    isServerForPlayersNotReady(): boolean {
        return (
            !this.expertPlayers.getValue() ||
            !this.expertPlayers.getValue().length ||
            !this.beginnerPlayers.getValue() ||
            !this.beginnerPlayers.getValue().length
        );
    }

    loadVirtualPlayerData(): void {
        this.getExpertPlayers().subscribe(this.expertPlayers);
        this.getBeginnerPlayers().subscribe(this.beginnerPlayers);
    }

    isValidPlayerName(newPlayerName: string): boolean {
        if (!newPlayerName || newPlayerName === '') return false;
        return (
            this.usernameValidationService.isValidUsername(newPlayerName) &&
            this.expertPlayers.getValue().every((player) => player.name !== newPlayerName) &&
            this.beginnerPlayers.getValue().every((player) => player.name !== newPlayerName)
        );
    }

    resetScores(): Observable<ScorePack> {
        return this.http.delete<ScorePack>(`${this.baseUrl}/admin`).pipe(catchError(this.handleError<ScorePack>('resetScores')));
    }

    getExpertPlayers(): Observable<VirtualPlayerInfo[]> {
        return this.http
            .get<VirtualPlayerInfo[]>(`${this.baseUrl}/vp/false`)
            .pipe(catchError(this.handleError<VirtualPlayerInfo[]>('getExpertPlayers')));
    }

    getBeginnerPlayers(): Observable<VirtualPlayerInfo[]> {
        return this.http
            .get<VirtualPlayerInfo[]>(`${this.baseUrl}/vp/true`)
            .pipe(catchError(this.handleError<VirtualPlayerInfo[]>('getBeginnerPlayers')));
    }

    getGameLogs(): Observable<GameLog[]> {
        return this.http.get<GameLog[]>(`${this.baseUrl}/logs/`).pipe(catchError(this.handleError<GameLog[]>('getGameLogs')));
    }

    postVirtualPlayer(player: VirtualPlayerInfo): Observable<VirtualPlayerInfo> {
        return this.http
            .post<VirtualPlayerInfo>(`${this.baseUrl}/vp/`, player)
            .pipe(catchError(this.handleError<VirtualPlayerInfo>('postVirtualPlayer')));
    }

    modifyVirtualPlayer(name: string, player: VirtualPlayerInfo): Observable<VirtualPlayerInfo> {
        return this.http
            .patch<VirtualPlayerInfo>(`${this.baseUrl}/vp/${name}`, player)
            .pipe(catchError(this.handleError<VirtualPlayerInfo>('modifyVirtualPlayer')));
    }

    deleteVirtualPlayer(name: string): Observable<VirtualPlayerInfo> {
        return this.http
            .delete<VirtualPlayerInfo>(`${this.baseUrl}/vp/${name}`)
            .pipe(catchError(this.handleError<VirtualPlayerInfo>('deleteVirtualPlayer')));
    }

    resetVirtualPlayers(): Observable<VirtualPlayerInfo> {
        return this.http
            .delete<VirtualPlayerInfo>(`${this.baseUrl}/vp/`)
            .pipe(catchError(this.handleError<VirtualPlayerInfo>('resetVirtualPlayers')));
    }

    deleteGameLogs(): Observable<GameLog[]> {
        return this.http.delete<GameLog[]>(`${this.baseUrl}/logs/`).pipe(catchError(this.handleError<GameLog[]>('deleteGameLogs')));
    }

    handleError<T>(_request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
