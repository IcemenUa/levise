
import { IUser } from '../interfaces/user.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
export interface IOrder {
    userID: string;
    orderDate: string;
    basket: Array<IProduct>;
    urerData: IUser;
    doneStatus: boolean;
}