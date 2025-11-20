// src/app/app.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="app-container">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    /* CORRECTION DU FOND VERT #1a2a1a */
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--black-bg); /* Utilise la variable Noir */
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class App {
  title = 'elaya';
}