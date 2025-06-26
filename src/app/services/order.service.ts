import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OrderRequest, OrderData } from '../models/order.model';

// 1. IMPORTE O OBJETO DE AMBIENTE
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly fullApiUrl = `${environment.apiUrl}/send-order`;

  constructor(private http: HttpClient) {}

  private generateUniqueId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `pedido-${timestamp}-${random}`;
  }

  submitOrder(orderData: OrderData): Observable<any> {
    const request: OrderRequest = {
      MessageBody: {
        cliente_name: orderData.clientName,
        hamburguer_description: orderData.hamburguerDescription
      },
      MessageGroupId: this.generateUniqueId()
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Submitting order to URL:', this.fullApiUrl); // Log para depuração
    console.log('Request payload:', request);

    // 3. USE A NOVA URL COMPLETA NA CHAMADA HTTP
    return this.http.post(this.fullApiUrl, request, { 
      headers,
      responseType: 'text'
    }).pipe(
      map((response: string) => {
        console.log('Raw API response:', response);
        
        const isSuccessful = response.includes('SendMessageResponse') && 
                           response.includes('<MessageId>') && 
                           response.includes('</MessageId>');
        
        console.log('Response analysis - isSuccessful:', isSuccessful);
        
        if (isSuccessful) {
          console.log('✅ API call successful - returning success response');
          return {
            success: true,
            message: 'Order sent successfully',
            response: response
          };
        } else {
          console.log('❌ API call failed - unexpected response format');
          return {
            success: false,
            message: 'Unexpected API response format for a successful request.',
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