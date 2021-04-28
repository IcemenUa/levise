import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Order } from '../../shared/models/order.model';
import { ProfileService } from '../../shared/services/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  editStatus: boolean = false;
  userForm = this.formBuilder.group({
    "first name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "last name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "phone number": ["", Validators.required],
    "city": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "address": ["", [Validators.required]],
  })
  ordersInProgress: Array<Order> = [];
  doneOrders: Array<Order> = [];

  constructor(private firestore: AngularFirestore, private profileServise: ProfileService, private formBuilder: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.getOrders()
  }
  signOut(): void {
    this.auth.signOut()
  }

  getOrders(): void {
    this.ordersInProgress = [];
    this.doneOrders = [];
    const userID = JSON.parse(localStorage.getItem('user')).id
    this.firestore.collection('orders').ref.where('userID', '==', userID).where('doneStatus', '==', false).onSnapshot(
      snap => {
        snap.forEach(orderData => {
          const data = orderData.data() as any;
          const id = orderData.id;
          this.ordersInProgress.push({ id, ...data });
        });
      }
    )
    this.firestore.collection('orders').ref.where('userID', '==', userID).where('doneStatus', '==', true).onSnapshot(
      snap => {
        snap.forEach(orderData => {
          const data = orderData.data() as any;
          const id = orderData.id;
          this.doneOrders.push({ id, ...data });
        });
      }
    )

    console.log(this.ordersInProgress);

  }


}
