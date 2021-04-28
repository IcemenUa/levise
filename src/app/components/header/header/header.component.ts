import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { ISubCategory } from '../../../shared/interfaces/subCategory.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  LogInForm = this.formBuilder.group({
    "email": ["", [Validators.required]],
    "password": ["", [Validators.required]],
  })

  SignUpForm = this.formBuilder.group({
    "first name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "last name": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "phone number": ["", Validators.required],
    "city": ["", [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]],
    "address": ["", [Validators.required]],
    "email": ["", [Validators.required]],
    "password": ["", [Validators.required]],
  })

  logInStatus: boolean = false;
  registrarionStatus: boolean = false;
  modalRef: BsModalRef;
  leftMenuOpen: boolean;
  subCategoriesMenuOpen: boolean;
  categoriesArr: Array<ICategory>;
  subCategoriesArr: Array<ISubCategory> = [];
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private modalService: BsModalService, private categoryService: CategoriesService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getCategories();
    this.checkLogin();
    this.checkLocalUser();
  }


  private getCategories(): void {
    this.categoryService.getCategoriesFromFB().subscribe(
      collection => {
        this.categoriesArr = collection.map(category => {
          const data = category.payload.doc.data() as ICategory;
          const id = category.payload.doc.id;
          return { id, ...data };
        });
      }
    );
  }

  getSubCategories(categoryName: string): void {
    this.subCategoriesArr = [];
    this.firestore.collection('subCategories').ref.where('category', '==', categoryName).onSnapshot(
      snap => {
        snap.forEach(prodData => {
          const data = prodData.data() as ISubCategory;
          const id = prodData.id;
          this.subCategoriesArr.push({ id, ...data });
        });
      }
    );

  }

  openSubCategoriesMenu(categoryName: string): void {
    this.getSubCategories(categoryName)
    this.subCategoriesMenuOpen = true;
  }

  leftMenuToggle(): void {

    if (this.subCategoriesMenuOpen) {
      this.subCategoriesMenuOpen = false;
    }
    this.leftMenuOpen = !this.leftMenuOpen
  }
  subCategoriesMenuToggle(): void {
    this.subCategoriesMenuOpen = !this.subCategoriesMenuOpen
  }

  closeAllMenus(): void {
    this.leftMenuOpen = false;
    this.subCategoriesMenuOpen = false;
  }

  // AUTH

  private checkLogin(): void {
    this.auth.userStatus.subscribe(
      data => {
        console.log('userStatus', data);
        this.logInStatus = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  private checkLocalUser(): void {
    if (localStorage.getItem('user')) {
      const CURRENT_USER: IUser = JSON.parse(localStorage.getItem('user'));
      if (CURRENT_USER.role === 'user' && CURRENT_USER != null) {
        this.logInStatus = true;
      }
    }
    else {
      this.logInStatus = false;
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  signInToggle(): void {
    this.registrarionStatus = !this.registrarionStatus
    this.clearForms()
  }

  signIn(): void {
    this.auth.signIn(this.LogInForm.value.email, this.LogInForm.value.password)
    this.clearForms()
  }



  signUp(): void {
    this.auth.signUp(this.SignUpForm.value['first name'], this.SignUpForm.value['last name'], this.SignUpForm.value['phone number'], this.SignUpForm.value.city, this.SignUpForm.value.address, this.SignUpForm.value.email, this.SignUpForm.value.password)
    this.clearForms()
  }

  signOut(): void {
    this.auth.signOut()
  }

  private clearForms(): void {
    this.LogInForm.reset();
    this.SignUpForm.reset();
  }

}


