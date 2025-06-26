import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFormComponent } from './components/order-form/order-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, OrderFormComponent],
  template: `
    <div class="container">
      <app-order-form></app-order-form>
    </div>
  `
})
export class AppComponent {
  title = 'Order Manager';
}