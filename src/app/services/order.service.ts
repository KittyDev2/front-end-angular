import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OrderRequest, OrderData } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // CORREÇÃO AQUI: A apiUrl do ambiente JÁ É a URL completa do endpoint.
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitOrder(orderData: OrderData): Observable<any> {
    const request: OrderRequest = {
      cliente_name: orderData.clientName,
      hamburguer_description: orderData.hamburguerDescription
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Submitting order to FINAL URL:', this.apiUrl);
    console.log('Request payload:', request);

    // Agora a chamada usa diretamente a apiUrl, que já está correta.
    return this.http.post<any>(this.apiUrl, request, { headers }).pipe(
      map((response: any) => {
        console.log('Raw API response (JSON):', response);
        
        const isSuccessful = response?.SendMessageResponse?.SendMessageResult?.MessageId;
        
        console.log('Response analysis - isSuccessful:', !!isSuccessful);
        
        if (isSuccessful) {
          return {
            success: true,
            message: 'Order sent successfully',
            response: response
          };
        } else {
          return {
            success: false,
            message: 'Unexpected API response format.',
            response: response
          };
        }
      }),
      catchError((error) => {
        console.error('Service error:', error);
        throw error;
      })
    );
  }
}