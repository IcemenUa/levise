import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor() { }

  addToBasket(product: IProduct): void {
    let localBasket: Array<IProduct> = []
    if (localStorage.getItem('basket')) {
      localBasket = JSON.parse(localStorage.getItem('basket'));
      if (localBasket.some((prod) => prod.id === product.id)) {
        if (localBasket.some((prod) => prod.size === product.size)) {
          const index = localBasket.findIndex((prod) => prod.id === product.id);
          localBasket[index].quantity += product.quantity;
        }
        else { localBasket.push(product); }
      }
      else {
        localBasket.push(product);
      }
    }
    else {
      localBasket.push(product)
    }
    localStorage.setItem('basket', JSON.stringify(localBasket))
  }
  updateBasket(cart:Array<IProduct>): void {
    localStorage.removeItem('basket')
    localStorage.setItem('basket', JSON.stringify(cart))
  }
}
