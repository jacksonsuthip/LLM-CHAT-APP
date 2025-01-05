import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule, CommonModule, RouterOutlet, HeaderComponent, RouterModule],
  providers: []
})
export class AppComponent implements AfterViewInit {

  constructor(private router: Router, private renderer: Renderer2) { }

  ngAfterViewInit(): void {

  }

  navigateToNewChat() {
    this.router.navigate(['/chat', { refresh: new Date().getTime() }]);
  }

  navigateToListUrls() {
    this.router.navigate(['/list-urls']);
  }

}
