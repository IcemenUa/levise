import { IProduct } from "../interfaces/product.interface";
import { IProductDescription } from "../interfaces/productDescription.interface";
import { IProductSize } from '../interfaces/productSize.interface';

export class Product implements IProduct {

    constructor(
        public id: string,
        public name: string,
        public image: Array<string>,
        public size: string,
        public quantity: number,
        public price: number,
    ) { }

}