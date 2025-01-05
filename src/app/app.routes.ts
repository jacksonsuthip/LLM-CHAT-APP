import { Routes } from '@angular/router';
import { ListUrlsComponent } from './list-urls/list-urls.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    { path: '', redirectTo: 'chat', pathMatch: 'full' },
    { path: 'chat', component: ChatComponent },
    { path: 'list-urls', component: ListUrlsComponent },
];
