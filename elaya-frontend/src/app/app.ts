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
    /* Fond principal */
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--black-bg); /* Variable Noir */
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    /* Mobile */
    @media (max-width: 600px) {
      .main-content {
        padding: 12px;
      }

      .app-container {
        padding-bottom: 10px;
      }

      app-header, app-footer {
        width: 100%;
      }
      * {
        max-width: 100%;
        box-sizing: border-box;
      }
    }

    /* Tablette */
    @media (min-width: 600px) and (max-width: 1024px) {
      .main-content {
        padding: 16px;
      }
    }

    /* Desktop large */
    @media (min-width: 1024px) {
      .main-content {
        padding: 24px;
      }
    }
  `]
  
})
export class App {
  title = 'elaya';
}
