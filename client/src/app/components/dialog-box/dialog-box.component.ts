import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { DialogBoxService } from '@app/services/dialog-box/dialog-box.service';

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements AfterViewInit {
    @ViewChild('messageScroll', { static: false }) private readonly messageScroll!: ElementRef<HTMLDivElement>;
    @ViewChild('inputDialogBox', { static: false }) private readonly inputDialogBox!: ElementRef<HTMLInputElement>;

    userMessage: string;
    selfPLayerName: string;
    opponentPlayerName: string;

    constructor(private readonly dialogService: DialogBoxService) {
        this.selfPLayerName = this.dialogService.getSelfPlayerName();
        this.opponentPlayerName = this.dialogService.getOpponentName();
    }

    ngAfterViewInit(): void {
        this.dialogService.resetMessages();
        Promise.resolve().then(() => this.inputDialogBox.nativeElement.focus());
    }

    get chatMessages(): ChatMessage[] {
        const elem: HTMLElement | null = document.getElementById('container-message');
        if (elem) elem.scrollTop = elem.scrollHeight;
        return this.dialogService.chatMessages;
    }

    get maxLengthOfInput(): string {
        return this.dialogService.maxLengthOfInput;
    }

    submitInput(): void {
        const emptyInputValue = '';
        this.dialogService.submitUserInput(this.userMessage);
        this.userMessage = emptyInputValue;

        setTimeout(() => {
            this.adjustScroll();
        }, 0);
    }

    displayTimeFormat(date: Date): string {
        return this.dialogService.displayTimeFormat(date);
    }

    getMessageColorClass(message: ChatMessage): string {
        return this.dialogService.getMessageColorClass(message);
    }

    adjustScroll(): void {
        this.messageScroll.nativeElement.scrollTop = this.messageScroll.nativeElement.scrollHeight;
    }
}
