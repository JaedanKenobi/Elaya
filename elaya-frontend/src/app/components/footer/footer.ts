import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-col brand">
          <h3>ELAYA.</h3>
          <p>L'âme de l'Afrique dans votre assiette.<br>Cuisine fusion & authentique.</p>
        </div>
        <div class="footer-col">
          <h4>Horaires</h4>
          <p>Mardi - Dimanche : 11h45 - 14h00</p>
          <p>Soirs & Week-end : 18h00 - 22h30</p>
        </div>
        <div class="footer-col">
          <h4>Nous trouver</h4>
          <p>2 Rue Victor Hugo<br>63300 THIERS</p>
          <div class="socials">
            <span>Instagram</span> • <span>Facebook</span>
          </div>
        </div>
      </div>
      <div class="copyright">
        © 2025 Elaya Restaurant. Powered by AfroTech.
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #050505;
      border-top: 4px solid var(--gold);
      padding: 4rem 0 1rem;
      margin-top: auto; /* Colle le footer en bas si la page est courte */
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      width: 90%;
      max-width: 1200px;
      margin: 0 auto 3rem;
      flex-wrap: wrap;
      gap: 2rem;
    }
    .footer-col h3 { color: var(--gold); font-size: 2rem; margin: 0 0 1rem;}
    .footer-col h4 { color: var(--text-main); margin: 0 0 1rem; font-size: 1.2rem;}
    .footer-col p { color: var(--text-muted); line-height: 1.6; font-size: 0.9rem; margin: 0;}
    .copyright { 
      text-align: center; color: #444; font-size: 0.8rem; 
      border-top: 1px solid #222; padding-top: 20px; width: 90%; margin: 0 auto;
    }
  `]
})
export class Footer {}