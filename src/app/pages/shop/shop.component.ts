import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  productsArr: Array<any> = [];



  constructor(private firestore: AngularFirestore, private activatedRoute: ActivatedRoute, private router: Router) {


    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const categoryName = this.activatedRoute.snapshot.paramMap.get('category');

      }
    })

    this.router.events.subscribe((event: Event) => {
      console.log(event);
      if (event instanceof NavigationEnd) {

        const categoryName = this.activatedRoute.snapshot.paramMap.get('category');
console.log(categoryName);
console.log('start');

        this.getProducts(categoryName);
        
      }
    });


  }

  ngOnInit(): void {
  
  }
  logID(prodID): void {
    console.log(prodID);

  }

  getProducts(categoryName): void {
    const subCategoryName = this.activatedRoute.snapshot.paramMap.get('subCategory');
    const CategoryName = this.activatedRoute.snapshot.paramMap.get('category');
    this.productsArr = [];
    this.firestore.collection('products').ref.where('productSubCategory', '==', subCategoryName).where('productCategory', '==', CategoryName).onSnapshot(
      snap => {
        snap.forEach(prodData => {
          const data = prodData.data() as any;
          const id = prodData.id;
          this.productsArr.push({ id, ...data });
        });
      }
    )

  }


}
