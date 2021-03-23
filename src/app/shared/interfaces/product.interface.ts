import { IProductDescription } from './productDescription.interface';
import { IProductSize } from './productSize.interface';

export interface IProduct {
    id: string,
    name: string,
    image:Array<string>,
    size:string
    quantity: number,
    price: number,
}