/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';
import { CHAT_MESSAGE_MAX_LENGTH } from '@app/classes/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { DialogBoxService } from '@app/services/dialog-box/dialog-box.service';
import { DialogBoxComponent } from './dialog-box.component';

describe('DialogBoxComponent', () => {
    let component: DialogBoxComponent;
    let fixture: ComponentFixture<DialogBoxComponent>;
    let dialogueSpy: jasmine.SpyObj<DialogBoxService>;

    beforeEach(async () => {
        dialogueSpy = jasmine.createSpyObj(
            'DialogBoxService',
            ['submitUserInput', 'displayTimeFormat', 'getMessageColorClass', 'resetMessages', 'getSelfPlayerName', 'getOpponentName'],
            {
                maxLengthOfInput: CHAT_MESSAGE_MAX_LENGTH,
                chatMessages: [],
            },
        );
        await TestBed.configureTestingModule({
            declarations: [DialogBoxComponent],
            providers: [{ provide: DialogBoxService, useValue: dialogueSpy }],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('submitUserInput() should call submitUserInput from dialogService', () => {
        component.userMessage = '';
        component.submitInput();
        expect(dialogueSpy.submitUserInput).toHaveBeenCalledWith(component.userMessage);
    });

    it('submitUserInput() should call adjustScroll', (done) => {
        const adjustSpy: jasmine.Spy<jasmine.Func> = spyOn(component, 'adjustScroll').and.stub();
        component.submitInput();
        setTimeout(() => {
            expect(adjustSpy).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('submitUserInput() should change userMessage to empty string', () => {
        component.submitInput();
        expect(component.userMessage).toEqual('');
    });

    it('displayTimeFormat() should call displayTimeFormat from dialogService', () => {
        const date: Date = new Date();
        component.displayTimeFormat(date);
        expect(dialogueSpy.displayTimeFormat).toHaveBeenCalledWith(date);
    });

    it('getMessageColorClass() should call getMessageColorClass from dialogService', () => {
        const msg: ChatMessage = {
            author: TypeOfUser.ERROR,
            text: 'CECI EST UNE ERREUR!!!',
            date: new Date(),
            lobbyId: '',
            socketId: '',
        };
        component.getMessageColorClass(msg);
        expect(dialogueSpy.getMessageColorClass).toHaveBeenCalledWith(msg);
    });
});
