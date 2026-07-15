import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  Cliente,
  CreateClienteDTO,
  ClienteListResponse,
  ClienteCreateResponse,
  ClienteErrorResponse
} from '../models/cliente.model';

@Injectable({
  providedIn: 'root'  // El servicio estará disponible en toda la aplicación
})
export class ClienteService {
  // URL base de la API (configurable según entorno)
  private apiUrl = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los clientes
   * @returns Observable con la lista de clientes
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<ClienteListResponse>(this.apiUrl)
      .pipe(
        map(response => response.data),  // Extraemos solo el array de clientes
        catchError(this.handleError)
      );
  }

  /**
   * Crear un nuevo cliente
   * @param cliente - Datos del cliente a crear
   * @returns Observable con el cliente creado
   */
  createCliente(cliente: CreateClienteDTO): Observable<Cliente> {
    return this.http.post<ClienteCreateResponse>(this.apiUrl, cliente)
      .pipe(
        map(response => response.data),  // Extraemos solo el cliente creado
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores centralizado
   * @param error - Error HTTP
   * @returns Observable con el error formateado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error en la comunicación con el servidor';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      const serverError = error.error as ClienteErrorResponse;
      
      if (serverError.errors && serverError.errors.length > 0) {
        // Si hay errores de validación específicos
        errorMessage = serverError.errors.join(', ');
      } else if (serverError.error) {
        errorMessage = serverError.error;
      } else {
        errorMessage = `Código ${error.status}: ${error.message}`;
      }
    }

    console.error('Error en ClienteService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}