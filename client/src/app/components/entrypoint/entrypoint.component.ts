import { Component } from '@angular/core';

@Component({
    selector: 'app-entrypoint',
    templateUrl: './entrypoint.component.html',
})
export class EntryPointComponent {
    buttons: string[] = ['Mode classique', 'Mode LOG2990', 'Meilleurs scores'];
}
