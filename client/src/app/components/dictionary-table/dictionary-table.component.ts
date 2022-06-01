import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { UploadDictionaryDialogComponent } from '@app/components/upload-dictionary-dialog/upload-dictionary-dialog.component';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import * as componentConstants from './dictionary-table.component.constants';

@Component({
    selector: 'app-dictionary-table',
    templateUrl: './dictionary-table.component.html',
    styleUrls: ['./dictionary-table.component.scss'],
})
export class DictionaryTableComponent {
    @Input() dictionaries: Dictionary[];
    columnNames;
    dictionaryToDownload: Dictionary;
    activeDictionaryEdit: Dictionary;
    dictionariesInput: Dictionary[];

    constructor(public dialog: MatDialog, private readonly dictionariesManagerService: DictionariesManagerService) {
        this.columnNames = componentConstants.DICTIONARY_TABLE_COLUMN_NAMES;
        this.activeDictionaryEdit = {} as Dictionary;
        this.dictionariesInput = [];
    }

    get isServerNotReady(): boolean {
        return this.updatedDictionaries && !this.updatedDictionaries.length;
    }

    get updatedDictionaries(): Dictionary[] {
        if (!this.dictionaries) return [];
        if (this.dictionaries.length === this.dictionariesInput.length) return this.dictionariesInput;
        this.dictionariesInput = [];
        this.dictionaries.forEach((dictionary) => this.dictionariesInput.push(dictionary));
        return this.dictionariesInput;
    }

    isValidDictionaryInfo(dictionaryIndex: number): boolean {
        return this.isValidTitle(this.dictionariesInput[dictionaryIndex].title) && this.dictionariesInput[dictionaryIndex].description !== '';
    }

    isDefaultDictionary(title: string): boolean {
        return title === componentConstants.DEFAULT_DICTIONARY;
    }

    openUploadDialog(): void {
        const dialogAddDictionary: MatDialogRef<UploadDictionaryDialogComponent> = this.dialog.open(UploadDictionaryDialogComponent, {
            disableClose: true,
        });
        dialogAddDictionary.afterClosed().subscribe(() => this.dictionariesManagerService.loadDictionaryData());
    }

    activateDictionaryEdit(dictionary: Dictionary): void {
        this.dictionariesManagerService.loadDictionaryData();
        this.activeDictionaryEdit = dictionary;
    }

    canEditDictionary(dictionary: Dictionary): boolean {
        return dictionary.title === this.activeDictionaryEdit.title;
    }

    editDictionary(dictionaryIndex: number): void {
        this.dictionariesManagerService
            .modifyDictionary(this.activeDictionaryEdit.title, {
                title: this.dictionariesInput[dictionaryIndex].title.trim(),
                description: this.dictionariesInput[dictionaryIndex].description.trim(),
                words: this.activeDictionaryEdit.words,
            } as Dictionary)
            .subscribe(() => {
                this.dictionariesManagerService.loadDictionaryData();
                this.activeDictionaryEdit = {} as Dictionary;
            });
    }

    downloadDictionary(dictionary: Dictionary): void {
        const anchorElement: HTMLElement | null = document.getElementById(dictionary.title);
        if (!anchorElement) return;
        if (this.isAnchorElementReady(anchorElement)) return;
        this.setAnchorElementForDownload(anchorElement, dictionary);
    }

    cancelDictionaryEdit(dictionaryIndex: number): void {
        this.dictionariesManagerService.loadDictionaryData();
        this.dictionariesInput[dictionaryIndex] = this.dictionaries[dictionaryIndex];
        this.activeDictionaryEdit = {} as Dictionary;
    }

    deleteDictionary(dictionary: Dictionary): void {
        this.dictionariesManagerService.deleteDictionary(dictionary).subscribe(() => {
            this.dictionariesManagerService.loadDictionaryData();
        });
    }

    private setAnchorElementForDownload(anchorElement: HTMLElement, dictionary: Dictionary): void {
        this.dictionariesManagerService.getDictionary(dictionary.title).subscribe((dict) => {
            this.dictionaryToDownload = dict;
        });
        setTimeout(() => {
            const dictionaryURL = componentConstants.DICTIONARY_URL + JSON.stringify(this.dictionaryToDownload);
            anchorElement.setAttribute(componentConstants.ATTRIBUTE_DOWNLOAD, dictionary.title + componentConstants.JSON_EXTENSION);
            anchorElement.setAttribute(componentConstants.ATTRIBUTE_HREF, dictionaryURL);
            anchorElement.click();
        }, componentConstants.WAIT_TIME);
    }

    private isAnchorElementReady(anchorElement: HTMLElement): boolean {
        return anchorElement.hasAttribute(componentConstants.ATTRIBUTE_DOWNLOAD) && anchorElement.hasAttribute(componentConstants.ATTRIBUTE_HREF);
    }

    private isValidTitle(title: string): boolean {
        return this.dictionariesManagerService.isValidDictionaryTitle(title) || title === this.activeDictionaryEdit.title;
    }
}
