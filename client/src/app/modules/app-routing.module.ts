import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { GameChoiceComponent } from '@app/pages/game-choice-page/game-choice-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { JoinMultiplayerComponent } from '@app/pages/join-multiplayer-page/join-multiplayer-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MultiplayerComponent } from '@app/pages/multiplayer-page/multiplayer-page.component';
import { ParametersComponent } from '@app/pages/parameters-page/parameters-page.component';
import { ScoresComponent } from '@app/pages/scores/scores.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game/:id', component: GamePageComponent },
    { path: 'classic', component: GameChoiceComponent },
    { path: 'gameChoice', component: GameChoiceComponent },
    { path: 'parameters', component: ParametersComponent },
    { path: 'multiplayerList', component: MultiplayerComponent },
    { path: 'multiplayerChoice', component: JoinMultiplayerComponent },
    { path: 'scores', component: ScoresComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [BrowserModule, CommonModule, RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
