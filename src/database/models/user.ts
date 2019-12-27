import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, DeletedAt,  BelongsToMany } from 'sequelize-typescript';


import { Group } from './group';
import { UserGroup } from './usergroup';
import { UserExpence } from './userexpence';
import { UserContact } from './usercontact';


@Table({
    timestamps: true,
    paranoid: true
})
export class User extends Model<User> {

    @Column
    name: string;

    @Column
    email: string;

    @Column
    phone: number;

    @Column
    password: string;

    @Column
    isRegistrationCompleted: boolean;

    @HasMany(() => UserExpence, 'fkUserId')
    expences: UserExpence[];

    @HasMany(() => UserExpence, 'fkPaidBy')
    lent: UserExpence[];

    @BelongsToMany(() => User, () => UserContact)
    contacts: User[];

    @BelongsToMany(() => Group, () => UserGroup)
    groups: Group[];

    @CreatedAt
    @Column
    createdDateTime: Date;

    @UpdatedAt
    @Column
    updatedDateTime: Date;

    @DeletedAt
    @Column
    deletedDateTime: Date;
}