import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { constants } from 'buffer';
import { IProduct } from '../interfaces/product.interface';
import { Order } from '../models/order.model';
import { IOrder } from '../interfaces/order.interface';


@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private firestore: AngularFirestore) { }

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
  updateBasket(cart: Array<IProduct>): void {
    localStorage.removeItem('basket')
    localStorage.setItem('basket', JSON.stringify(cart))
  }
  clearBasket(): void {
    localStorage.removeItem('basket')
  }
  createOrder(userData) {
    const date = new Date();
  
    const orderDate =
      date.getDate() +
      '/' +
      (date.getMonth()+1) +
      '/' +
      date.getFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes();

    let NEW_ORDER: Order
    const basket = JSON.parse(localStorage.getItem('basket'))
    if (localStorage.getItem('user')) {
      console.log(orderDate)
      const id = JSON.parse(localStorage.getItem('user')).id
      NEW_ORDER = new Order(id, orderDate, basket, userData)
    }
    else {
      NEW_ORDER = new Order('without sign in', orderDate, basket, userData)

    }

    return this.firestore.collection('orders').add({ ...NEW_ORDER })
      .then(() =>
        this.clearBasket()
      )
      .catch(err => console.log(err)
      )
  }
}
