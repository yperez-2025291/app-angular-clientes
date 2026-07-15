import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Lista de Clientes</h2>

      <!-- Estado de carga -->
      <div *ngIf="loading" class="loading">
        ⏳ Cargando clientes...
      </div>

      <!-- Estado de error -->
      <div *ngIf="error" class="error">
        ❌ {{ error }}
      </div>

      <!-- Tabla de clientes - Se muestra SOLO cuando no hay carga ni error -->
      <ng-container *ngIf="!loading && !error">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes">
              <td>{{ cliente.codigo_cliente }}</td>
              <td>{{ cliente.nombre }}</td>
              <td>{{ cliente.direccion || '-' }}</td>
              <td>{{ cliente.telefono || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vacío -->
        <div *ngIf="clientes.length === 0" class="empty">
          📭 No hay clientes registrados.
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .container {
      margin: 0;
      padding: 0;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .table th, .table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .table th {
      background-color: #e9ecef;
      font-weight: bold;
    }
    .table tr:hover {
      background-color: #f5f5f5;
    }
    .loading {
      color: #007bff;
      padding: 20px;
      text-align: center;
      font-size: 16px;
    }
    .error {
      color: #dc3545;
      padding: 20px;
      text-align: center;
    }
    .empty {
      color: #6c757d;
      padding: 20px;
      text-align: center;
    }
  `]
})

export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.error = null;
    this.clientes = [];

    console.log('🔄 Solicitando clientes...');

    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        console.log('✅ Clientes recibidos:', clientes);
        this.clientes = clientes;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error = err.message || 'Error al cargar los clientes';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ ESTE MÉTODO DEBE EXISTIR
  recargar(): void {
    console.log('🔄 Recargando lista de clientes...');
    this.cargarClientes();
  }
}