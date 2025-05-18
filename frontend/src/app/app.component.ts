import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { SessionService } from './services/session-manage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, SweetAlert2Module],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myQuiz';
  constructor(private route: Router, private session: SessionService) {
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.session.shouldWarn = !(url.includes('login') || url.includes('registro'));
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event: BeforeUnloadEvent) {
    if (this.session.shouldWarn) {
      $event.preventDefault();
    }
  }
}
