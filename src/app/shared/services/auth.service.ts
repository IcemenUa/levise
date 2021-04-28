import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userStatus = new Subject<boolean>()
  constructor(private toastr: ToastrService,private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  signIn(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponce => {
        this.firestore
          .collection('users')
          .ref.where('id', '==', userResponce.user.uid)
          .onSnapshot(snap => {
            snap.forEach(user => {
              const USER = {
                id: user.id,
                ...(user.data() as IUser)
              };
              localStorage.setItem('user', JSON.stringify(USER));
              this.userStatus.next(true);
              this.router.navigateByUrl('/auth');

            })
          })
      }).catch(err => this.toastr.error("Eror", err))
  }

  signOut(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.userStatus.next(false);
        this.router.navigateByUrl('/home');
      })
      .catch(err => console.log(err));
  }

  signUp(firstName: string, lastName: string, phone: string, city: string, address: string, email: string, password: string): void {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(userResponse => {
        const newUser = new User(userResponse.user.uid, firstName, lastName, phone, userResponse.user.email, city, address);
        this.firestore.collection('users')
          .add({ ...newUser })
          .then(colection => {
            colection.get().then(userCredential => {
              this.userStatus.next(true);
              this.router.navigateByUrl('/auth');
              const id = userCredential.id;
              const data = userCredential.data();
              const localUser = { id, ...(data as IUser) };
              localStorage.setItem('user', JSON.stringify(localUser));

            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => this.toastr.error("Eror", err));
  }


}
