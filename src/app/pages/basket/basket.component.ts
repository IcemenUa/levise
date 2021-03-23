import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { BasketService } from '../../shared/services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket: Array<IProduct> = [];
  totalPrice: number;


  purchaseForm = this.formBuilder.group({
    "first name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "last name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "phone number": ["", Validators.required],
    "city": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "address": ["", [Validators.required]],
  })

  constructor(private formBuilder: FormBuilder, private basketService: BasketService) { }

  ngOnInit(): void {
    this.getLocalBasket(); this.getTotalPrice()
  }

  private getLocalBasket(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'))
    }
    console.log(this.basket);

  }
  quantityIncrement(index): void {
    if (this.basket[index].quantity < 99) {
      this.basket[index].quantity++
    }
    this.basketService.updateBasket(this.basket)
    this.getTotalPrice()
  }
  quantityDecrement(index): void {
    if (this.basket[index].quantity > 1) {
      this.basket[index].quantity--
    }
    this.basketService.updateBasket(this.basket)
    this.getTotalPrice()
  }
  removeProduct(index): void {
    this.basket.splice(index, 1);
    this.basketService.updateBasket(this.basket)
    this.getTotalPrice()
  }
  private getTotalPrice(): void {
    if (this.basket) {
      this.totalPrice = this.basket.reduce((total, product) => total + product.price * product.quantity, 0);
    }
  }
}
