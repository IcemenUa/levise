import { IUser } from '../interfaces/user.interface';
export class User implements IUser {
    readonly role = 'user';
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public phone: string,
        public email: string,
        public city: string,
        public address: string
    ) { }
}