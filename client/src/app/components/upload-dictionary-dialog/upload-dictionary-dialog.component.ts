import { Component } from '@angular/core';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import * as componentConstants from './upload-dictionary-dialog.component.constants';

@Component({
    selector: 'app-upload-dictionary-dialog',
    templateUrl: './upload-dictionary-dialog.component.html',
    styleUrls: ['./upload-dictionary-dialog.component.scss'],
})
export class UploadDictionaryDialogComponent {
    file: string;
    hasAddedDictionary: boolean;

    constructor(private readonly dictionariesManagerService: DictionariesManagerService) {
        this.hasAddedDictionary = false;
    }

    get isDictionaryValid(): boolean {
        if (!this.file) return false;
        return this.dictionariesManagerService.isValidNewDictionary(this.file);
    }

    get isValidSubmission(): boolean {
        return this.dictionariesManagerService.isValid;
    }

    get fileName(): string {
        return this.file ? this.file.slice(this.file.lastIndexOf(componentConstants.SLASH_CHARACTER) + 1) : '';
    }

    async validateDict(event: Event): Promise<void> {
        this.hasAddedDictionary = true;
        const target: HTMLInputElement | null = event.target as HTMLInputElement;
        const fileList: FileList | null = target.files;
        if (!target || !fileList) return;
        const fileContent: string = await this.dictionariesManagerService.readDictionary(fileList[0]);
        this.dictionariesManagerService.dictVerification(fileContent);
        if (!this.isValidSubmission) this.file = '';
    }

    sendNewDictionary(): void {
        this.dictionariesManagerService.addNewDictionary();
        this.resetFile();
    }

    resetFile(): void {
        this.file = '';
        this.dictionariesManagerService.dictVerification(this.file);
    }
}
