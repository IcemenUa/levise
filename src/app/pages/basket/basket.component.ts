import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { User } from 'src/app/shared/models/user.model';
import { BasketService } from '../../shared/services/basket.service';
import { IUser } from '../../shared/interfaces/user.interface';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket: Array<IProduct> = [];
  totalPrice: number;
  logInStatus: boolean = false;

  purchaseForm = this.formBuilder.group({
    "first name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "last name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "phone number": ["0", [Validators.required,Validators.pattern("^0[0-9]{9}$")]],
    "email": ["", [Validators.required,Validators.email]],
    "city": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "address": ["", [Validators.required]],
  })

  constructor(private toastr: ToastrService, private auth: AuthService, private formBuilder: FormBuilder, private basketService: BasketService) { }

  ngOnInit(): void {
    this.getLocalBasket(); this.getTotalPrice(); this.checkLocalUser()
  }


  private checkLocalUser(): void {
    if (localStorage.getItem('user')) {
      const CURRENT_USER: IUser = JSON.parse(localStorage.getItem('user'));
      if (CURRENT_USER.role === 'user' && CURRENT_USER != null) {
        this.logInStatus = true;
        const user = JSON.parse(localStorage.getItem('user'))
        this.purchaseForm = this.formBuilder.group({
          "first name": [user.firstName, [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
          "last name": [user.lastName, [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
          "phone number": [user.phone, [Validators.required,Validators.pattern("^0[0-9]{9}$")]],
          "email": [user.email, [Validators.required,Validators.email]],
          "city": [user.city, [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
          "address": [user.address, [Validators.required, Validators.pattern("[a-zA-Z0-9]{3,15}")]],
        })
      }
    }
    else {
      this.logInStatus = false;
    }
  }



  private getLocalBasket(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'))
    }

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

  createOrder(): void {
    let userData: IUser
    if (localStorage.getItem('user')) {
      userData = JSON.parse(localStorage.getItem('user'))
    }
    else {
      userData = new User('not reg', this.purchaseForm.value['first name'], this.purchaseForm.value['last name'], this.purchaseForm.value['phone number'], this.purchaseForm.value.email, this.purchaseForm.value.city, this.purchaseForm.value.address)


    };

    if (this.purchaseForm.valid && this.basket.length != 0) {
      this.basketService.createOrder({ ...userData }).then(
        () =>
          this.basket = []
      ).then(() => this.toastr.success('the order is placed', 'Cart', {
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-bottom-right'
      }
      )).then(() => this.totalPrice = 0)
    }
    else if (this.basket.length === 0) {
      this.toastr.warning('please add something to your cart', 'Cart', {
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-bottom-right'
      })
    }
    else if (this.purchaseForm.invalid) {

      this.toastr.warning('please check order form', 'Cart', {
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-bottom-right'
      })

    }
  }
}
