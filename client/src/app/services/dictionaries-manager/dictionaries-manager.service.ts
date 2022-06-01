import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as serviceConstants from './dictionaries-manager.service.constants';

@Injectable({
    providedIn: 'root',
})
export class DictionariesManagerService {
    isValid: boolean;
    dictionaries: BehaviorSubject<Dictionary[]>;
    dictionary: Dictionary;
    private reader: FileReader;
    private readonly baseUrl: string;

    constructor(private readonly http: HttpClient, private readonly adminDatabaseLinkService: AdminDatabaseLinkService) {
        this.isValid = false;
        this.dictionaries = new BehaviorSubject<Dictionary[]>([]);
        this.reader = new FileReader();
        this.baseUrl = environment.serverUrl;
    }

    isValidDictionaryTitle(title: string): boolean {
        if (!title || title === '') return false;
        return this.dictionaries.getValue().every((dictionary) => dictionary.title !== title);
    }

    loadDictionaryData(): void {
        this.getAllDictsResume().subscribe(this.dictionaries);
    }

    postDictionary(): Observable<Dictionary> {
        return this.http.post<Dictionary>(`${this.baseUrl}/dicts/`, this.dictionary);
    }

    getDictionary(title: string): Observable<Dictionary> {
        return this.http.get<Dictionary>(`${this.baseUrl}/dicts/${title}`);
    }

    isValidNewDictionary(dictionary: string): boolean {
        return this.isJson(dictionary) && this.isDictionary() && !this.isSameName();
    }

    dictVerification(dictionary: string): void {
        this.isValid = this.isValidNewDictionary(dictionary);
    }

    modifyDictionary(dictionaryTitle: string, modifiedDictionary: Dictionary): Observable<Dictionary> {
        return this.http
            .patch<Dictionary>(`${this.baseUrl}/dicts/${dictionaryTitle}`, modifiedDictionary)
            .pipe(catchError(this.adminDatabaseLinkService.handleError<Dictionary>('modifyDictionary')));
    }

    addNewDictionary(): void {
        if (!this.isValid) return;
        this.postDictionary().subscribe(() => this.loadDictionaryData());
        this.isValid = false;
    }

    deleteDictionary(dictionary: Dictionary): Observable<Dictionary> {
        return this.http
            .delete<Dictionary>(`${this.baseUrl}/dicts/${dictionary.title}`)
            .pipe(catchError(this.adminDatabaseLinkService.handleError<Dictionary>('deleteDictionary')));
    }

    resetAllDictionaries(): Observable<Dictionary> {
        return this.http
            .delete<Dictionary>(`${this.baseUrl}/dicts/`)
            .pipe(catchError(this.adminDatabaseLinkService.handleError<Dictionary>('resetAllDictionaries')));
    }

    async readDictionary(file: File): Promise<string> {
        // eslint-disable-next-line no-unused-vars
        return new Promise<string>((resolve, _reject) => {
            if (!file) resolve('');
            this.reader = new FileReader();
            this.reader.onload = () => {
                // @ts-ignore -- condition verified above, cannot be undefined
                const text: string = this.reader.result.toString();
                if (text) resolve(text);
            };
            this.reader.readAsText(file);
        });
    }

    private getAllDictsResume(): Observable<Dictionary[]> {
        return this.http.get<Dictionary[]>(`${this.baseUrl}/dicts/`);
    }

    private isJson(uploadedItem: string): boolean {
        try {
            this.dictionary = JSON.parse(uploadedItem);
        } catch (e) {
            return false;
        }

        return typeof this.dictionary === serviceConstants.OBJECT_STRING && this.dictionary !== null;
    }

    private isDictionary(): boolean {
        return !(!this.dictionary.title || !this.dictionary.description || !this.dictionary.words);
    }

    private isSameName(): boolean {
        const dict: Dictionary | undefined = this.dictionaries
            .getValue()
            .find((aDictonary: Dictionary) => aDictonary.title === this.dictionary.title);
        return dict !== undefined;
    }
}
