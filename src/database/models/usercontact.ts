import { Table, Column, Model, ForeignKey} from 'sequelize-typescript';
import { User } from './user';

@Table({
    timestamps: false
})
export class UserContact extends Model<UserContact> {

    @ForeignKey(() => User)
    @Column
    fkUserId: number;

    @ForeignKey(() => User)
    @Column
    fkContactId: number;
    
}