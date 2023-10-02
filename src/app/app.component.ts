import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private router = new Router()

  to(path: string) {
    this.router.navigateByUrl(path)
  }

}

