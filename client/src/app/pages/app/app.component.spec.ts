import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppComponent } from '@app/pages/app/app.component';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let socketServiceSpy: jasmine.SpyObj<SocketClientService>;

    beforeEach(async () => {
        socketServiceSpy = jasmine.createSpyObj(SocketClientService, ['isSocketAlive', 'connect', 'reconnect']);
        await TestBed.configureTestingModule({
            imports: [AppRoutingModule],
            declarations: [AppComponent],
            providers: [{ provide: SocketClientService, useValue: socketServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('onInit, should call isSocketAlive', () => {
        component.ngOnInit();
        expect(socketServiceSpy.isSocketAlive).toHaveBeenCalled();
    });

    it("onInit, should call getItem from localStorage and reconnect from sockeClient if getItem return isn't null", () => {
        const localStorageSpy: jasmine.Spy<(key: string) => string | null> = spyOn(window.localStorage, 'getItem').and.returnValue('ValidString');
        component.ngOnInit();
        expect(localStorageSpy).toHaveBeenCalled();
        expect(socketServiceSpy.reconnect).toHaveBeenCalled();
    });

    it('onInit, should call getItem from localStorage and reconnect from sockeClient if getItem return is null', () => {
        const localStorageSpy: jasmine.Spy<(key: string) => string | null> = spyOn(window.localStorage, 'getItem').and.returnValue(null);
        component.ngOnInit();
        expect(localStorageSpy).toHaveBeenCalled();
        expect(socketServiceSpy.connect).toHaveBeenCalled();
    });
});
