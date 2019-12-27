import { Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { Expence } from './expence';


@Table({
    timestamps: true,
    paranoid: true
})
export class UserExpence extends Model<UserExpence> {

    @Column
    amount: number;

    @ForeignKey(() => User)
    @Column
    fkUserId: number;

    @ForeignKey(() => User)
    @Column
    fkPaidBy: number;

    @ForeignKey(() => Expence)
    @Column
    fkExpenceId: number;

    @Column
    isSetteledUp: boolean;

    @BelongsTo(() => Expence)
    expence: Expence;

    @BelongsTo(() => User, 'fkUserId')
    oweby: User;

    @BelongsTo(() => User, 'fkPaidBy')
    payee: User;

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