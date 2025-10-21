// src/app/components/footer/footer.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer-container">
      <div class="footer-content">
        <!-- Hours -->
        <div class="footer-section">
          <p>MARDI À DIMANCHE : 11H45 - 14H00</p>
          <p>MARDI À JEUDI ET DIMANCHE : 18H00 - 22H00</p>
          <p>VENDREDI - SAMEDI : 18H00 - 22H30</p>
        </div>

        <!-- Address -->
        <div class="footer-section center">
          <p>2 RUE VICTOR HUGO</p>
          <p>63300 THIERS</p>
        </div>

        <!-- Social -->
        <div class="footer-section right">
          <p class="social-title">SUIVEZ-NOUS !</p>
          <div class="social-icons">
            <!-- Twitter -->
            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
            <!-- Facebook -->
            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
            <!-- Instagram -->
            <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="copyright">
        © 2020 by Melissa. Powered and secured by Wix
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      padding: 3rem 5rem 1.5rem;
      background-color: transparent;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      color: white;
      font-size: 0.625rem;
      font-family: Arial, Helvetica, sans-serif;
      opacity: 0.75;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .footer-section.center {
      text-align: center;
    }

    .footer-section.right {
      text-align: right;
    }

    .footer-section p {
      margin: 0;
      line-height: 1.6;
    }

    .social-title {
      margin-bottom: 0.375rem;
    }

    .social-icons {
      display: flex;
      gap: 0.625rem;
      justify-content: flex-end;
    }

    .social-icon {
      width: 0.875rem;
      height: 0.875rem;
      color: white;
      cursor: pointer;
      transition: color 0.3s;
    }

    .social-icon:hover {
      color: #d4a574;
    }

    .copyright {
      text-align: center;
      color: white;
      font-size: 0.563rem;
      font-family: Arial, Helvetica, sans-serif;
      opacity: 0.5;
      margin-top: 1.5rem;
    }

    @media (max-width: 1024px) {
      .footer-container {
        padding: 2rem 2rem 1rem;
      }

      .footer-content {
        font-size: 0.563rem;
      }
    }

    @media (max-width: 768px) {
      .footer-container {
        padding: 2rem 1rem 1rem;
      }

      .footer-content {
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        text-align: center;
      }

      .footer-section {
        align-items: center;
      }

      .footer-section.right {
        text-align: center;
      }

      .social-icons {
        justify-content: center;
      }
    }
  `]
})
export class Footer {}