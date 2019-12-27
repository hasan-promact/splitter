import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, DeletedAt, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { User } from './user';
import { UserGroup } from './usergroup';
import { Expence } from './expence';


@Table({
    timestamps: true,
    paranoid: true
})
export class Group extends Model<Group> {

    @Column
    name: string;

    @Column
    description: string;

    @ForeignKey(() => User)
    @Column
    fkCreatorUserId: number;

    @Column
    isSetteled: boolean;

    @HasMany(() => Expence)
    expence: Expence[];

    @BelongsToMany(() => User, () => UserGroup)
    users: User[];

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