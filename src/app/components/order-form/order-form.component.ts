import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { OrderData } from '../../models/order.model';
import { AlertComponent } from '../alert/alert.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, LoadingSpinnerComponent],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    this.orderForm = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      hamburguerDescription: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.isSubmitting = true;
      this.clearMessages();

      const orderData: OrderData = {
        clientName: this.orderForm.value.clientName.trim(),
        hamburguerDescription: this.orderForm.value.hamburguerDescription.trim()
      };

      console.log('🚀 Submitting order:', orderData);

      this.orderService.submitOrder(orderData).subscribe({
        next: (response) => {
          console.log('📦 Service response received:', response);
          this.isSubmitting = false;
          
          if (response.success) {
            this.successMessage = `Order successfully sent for ${orderData.clientName}! Your ${orderData.hamburguerDescription} is being processed.`;
            console.log('✅ SUCCESS MESSAGE SET:', this.successMessage);
            
            // Force change detection to ensure the UI updates
            this.cdr.detectChanges();
            
            this.orderForm.reset();
            
            // Clear success message after 5 seconds (increased from immediate clearing)
            setTimeout(() => {
              this.successMessage = '';
              this.cdr.detectChanges();
              console.log('🧹 Success message cleared after 5 seconds');
            }, 5000);
          } else {
            // Handle cases where response.success is false
            this.errorMessage = response.message;
            console.log('❌ Error message set:', this.errorMessage);
            this.cdr.detectChanges();
            
            setTimeout(() => {
              this.errorMessage = '';
              this.cdr.detectChanges();
            }, 8000);
          }
        },
        error: (error) => {
          console.error('💥 Order submission error:', error);
          this.isSubmitting = false;
          
          // Handle actual HTTP errors (4xx, 5xx) or network issues
          if (error.status === 0) {
            this.errorMessage = 'Failed to connect to the server. Please check your internet connection and try again.';
          } else if (error.status >= 400 && error.status < 500) {
            this.errorMessage = 'Invalid order data. Please check your input and try again.';
          } else if (error.status >= 500) {
            this.errorMessage = 'Server error occurred. Please try again in a few moments.';
          } else {
            this.errorMessage = 'Failed to send order. Please try again.';
          }
          
          console.log('❌ Error message set:', this.errorMessage);
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.errorMessage = '';
            this.cdr.detectChanges();
          }, 8000);
        }
      });
    } else {
      Object.keys(this.orderForm.controls).forEach(key => {
        this.orderForm.get(key)?.markAsTouched();
      });
    }
  }
}