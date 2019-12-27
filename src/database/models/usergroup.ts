import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user';
import { Group } from './group';


@Table({
    timestamps: false
})
export class UserGroup extends Model<UserGroup> {

    @ForeignKey(() => User)
    @Column
    fkUserId: number;

    @ForeignKey(() => Group)
    @Column
    fkGroupId: number;

}