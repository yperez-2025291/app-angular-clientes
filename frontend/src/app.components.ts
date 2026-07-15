import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClienteListComponent } from './components/cliente-list';
import { ClienteFormComponent } from './components/cliente-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteListComponent,
    ClienteFormComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>📋 Gestión de Clientes</h1>
      </header>
      <div class="main-content">
        <div class="form-section">
          <app-cliente-form (clienteCreado)="onClienteCreado()"></app-cliente-form>
        </div>
        <div class="list-section">
          <app-cliente-list #listaClientes></app-cliente-list>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #007bff;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    header h1 {
      margin: 0;
      font-size: 24px;
    }
    .main-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 20px;
    }
    .form-section, .list-section {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }
    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  // ⚠️ ATENCIÓN: El nombre debe coincidir con el # en el template
  @ViewChild('listaClientes') listaClientes!: ClienteListComponent;

  onClienteCreado(): void {
    console.log('🔄 Cliente creado, recargando lista...');
    this.listaClientes.recargar();  // ✅ Ahora existe
  }
}