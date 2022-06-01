import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyInfo } from '@app/../../../common/model/lobby-info';
import { ButtonsAreaComponent } from '@app/components/buttons-area/buttons-area.component';
import { EaselComponent } from '@app/components/easel/easel.component';
import { GiveUpPopupComponent } from '@app/components/give-up-popup/give-up-popup.component';
import { InformationAreaComponent } from '@app/components/information-area/information-area.component';
import { LeftSidebarComponent } from '@app/components/left-sidebar/left-sidebar.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { RightSidebarComponent } from '@app/components/right-sidebar/right-sidebar.component';
import { TileComponent } from '@app/components/tile/tile.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GameChoiceComponent } from '@app/pages/game-choice-page/game-choice-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { JoinMultiplayerComponent } from '@app/pages/join-multiplayer-page//join-multiplayer-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MultiplayerComponent } from '@app/pages/multiplayer-page/multiplayer-page.component';
import { ParametersComponent } from '@app/pages/parameters-page/parameters-page.component';
import { AngularWebStorageModule } from 'angular-web-storage';
import { AddVirtualPlayerDialogComponent } from './components/add-virtual-player-dialog/add-virtual-player-dialog.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { DictionaryTableComponent } from './components/dictionary-table/dictionary-table.component';
import { EndGameDialogComponent } from './components/end-game-dialog/end-game-dialog.component';
import { EntryPointComponent } from './components/entrypoint/entrypoint.component';
import { GameHistoryComponent } from './components/game-history/game-history.component';
import { HomeBtnComponent } from './components/home-btn/home-btn.component';
import { QuestDisplayComponent } from './components/quest-display/quest-display.component';
import { SliderFontSizeComponent } from './components/slider-font-size/slider-font-size.component';
import { TimerComponent } from './components/timer/timer.component';
import { UploadDictionaryDialogComponent } from './components/upload-dictionary-dialog/upload-dictionary-dialog.component';
import { VirtualPlayerListComponent } from './components/virtual-player-list/virtual-player-list.component';
import { VirtualPlayerSettingComponent } from './components/virtual-player-setting/virtual-player-setting.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ScoresComponent } from './pages/scores/scores.component';
import { DataPassingService } from './services/data-passing/data-passing.service';
import { PlayerManagementService } from './services/player-management/player-management.service';
import { SocketClientService } from './services/socket-client/socket-client.service';

@NgModule({
    declarations: [
        AppComponent,
        MainPageComponent,
        ParametersComponent,
        GamePageComponent,
        GameChoiceComponent,
        JoinMultiplayerComponent,
        PlayAreaComponent,
        LeftSidebarComponent,
        RightSidebarComponent,
        InformationAreaComponent,
        GiveUpPopupComponent,
        ButtonsAreaComponent,
        EaselComponent,
        TileComponent,
        TimerComponent,
        DialogBoxComponent,
        MultiplayerComponent,
        SliderFontSizeComponent,
        EntryPointComponent,
        ScoresComponent,
        VirtualPlayerSettingComponent,
        AdminPageComponent,
        VirtualPlayerListComponent,
        DictionaryTableComponent,
        GameHistoryComponent,
        UploadDictionaryDialogComponent,
        AddVirtualPlayerDialogComponent,
        HomeBtnComponent,
        QuestDisplayComponent,
        EndGameDialogComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ScrollingModule,
        AngularWebStorageModule,
        MatChipsModule,
        MatButtonToggleModule,
    ],
    providers: [
        GameChoiceComponent,
        ParametersComponent,
        JoinMultiplayerComponent,
        PlayerManagementService,
        MatSidenavModule,
        ScrollingModule,
        MultiplayerLobby,
        LobbyInfo,
        SocketClientService,
        DataPassingService,
        EndGameDialogComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
