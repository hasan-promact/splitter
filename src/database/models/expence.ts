import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, DeletedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { Group } from './group';
import { UserExpence } from './userexpence';

@Table({
    timestamps: true,
    paranoid: true
})
export class Expence extends Model<Expence> {

    @Column
    amount: number;

    @Column
    description: string;

    @ForeignKey(() => Group)
    @Column
    fkGroupId: number;

    @ForeignKey(() => User)
    @Column
    fkPaidBy: number;

    @ForeignKey(() => User)
    @Column
    fkCreatedBy: number;

    @Column
    isSetteledUp: boolean;

    @HasMany(() => UserExpence)
    expence: UserExpence[];

    @BelongsTo(() => Group)
    group: Group;

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