import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ClienteService } from '../services/cliente.service';
import { CreateClienteDTO } from '../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Registrar Nuevo Cliente</h2>

      <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="nombre">Nombre *</label>
          <input
            id="nombre"
            type="text"
            formControlName="nombre"
            placeholder="Ingrese el nombre del cliente"
            class="form-control"
            [class.is-invalid]="clienteForm.get('nombre')?.invalid && clienteForm.get('nombre')?.touched"
          />
          <div *ngIf="clienteForm.get('nombre')?.invalid && clienteForm.get('nombre')?.touched" class="error">
            El nombre es obligatorio
          </div>
        </div>

        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input
            id="direccion"
            type="text"
            formControlName="direccion"
            placeholder="Ingrese la dirección"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input
            id="telefono"
            type="text"
            formControlName="telefono"
            placeholder="Ingrese el teléfono"
            class="form-control"
          />
        </div>

        <button 
          type="submit" 
          [disabled]="clienteForm.invalid || submitting"
          class="btn btn-primary"
        >
          {{ submitting ? 'Guardando...' : 'Guardar Cliente' }}
        </button>
      </form>

      <!-- Mensajes de éxito/error -->
      <div *ngIf="successMessage" class="success">
        ✅ {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="error">
        ❌ {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      margin: 0;
      padding: 0;
    }
    h2 {
      margin-top: 0;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }
    .form-control.is-invalid {
      border-color: #dc3545;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }
    .success {
      color: #28a745;
      margin-top: 10px;
      padding: 10px;
      background-color: #d4edda;
      border-radius: 4px;
    }
  `]
})
export class ClienteFormComponent {
  // ============ PROPIEDADES ============
  clienteForm: FormGroup;
  submitting: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // ============ OUTPUT PARA NOTIFICAR AL PADRE ============
  @Output() clienteCreado = new EventEmitter<void>();

  // ============ CONSTRUCTOR ============
  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: [''],
      telefono: ['']
    });
  }

  // ============ MÉTODOS ============

  /**
   * Envía el formulario para crear un nuevo cliente
   */
  onSubmit(): void {
    // Si el formulario es inválido, no hacer nada
    if (this.clienteForm.invalid) {
      return;
    }

    // Limpiar mensajes anteriores
    this.successMessage = null;
    this.errorMessage = null;
    this.submitting = true;

    // Preparar los datos para enviar
    const clienteData: CreateClienteDTO = {
      nombre: this.clienteForm.value.nombre.trim(),
      direccion: this.clienteForm.value.direccion?.trim() || null,
      telefono: this.clienteForm.value.telefono?.trim() || null
    };

    console.log('📤 Enviando cliente:', clienteData);

    // Llamar al servicio
    this.clienteService.createCliente(clienteData).subscribe({
      next: (cliente) => {
        console.log('✅ Cliente creado:', cliente);
        
        // Mostrar mensaje de éxito
        this.successMessage = `Cliente "${cliente.nombre}" registrado correctamente (Código: ${cliente.codigo_cliente})`;
        this.submitting = false;
        
        // Limpiar el formulario
        this.clienteForm.reset();
        
        // Notificar al componente padre que se creó un cliente
        this.clienteCreado.emit();

        // Ocultar mensaje después de 4 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 4000);
      },
      error: (err) => {
        console.error('❌ Error al crear cliente:', err);
        this.errorMessage = err.message || 'Error al crear el cliente';
        this.submitting = false;
        
        // Ocultar mensaje después de 4 segundos
        setTimeout(() => {
          this.errorMessage = null;
        }, 4000);
      }
    });
  }
}