import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';
import { IUser } from '../interfaces/user.interface';


export class Order implements IOrder {
    public doneStatus = false
    constructor(
        public userID: string,
        public orderDate:string,
        public basket: Array<IProduct>,
        public urerData: IUser
    ) {

    }
}