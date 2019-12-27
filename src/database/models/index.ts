import { Sequelize } from 'sequelize-typescript';

const config = require('../config/config.json')
import { User } from './user';
import { UserGroup } from './usergroup';
import { Expence } from './expence';
import { Group } from './group';
import { UserExpence } from './userexpence';
import { UserContact } from './usercontact';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env]
const sequelize = new Sequelize({
    database: dbConfig['database'],
    dialect: dbConfig['dialect'],
    username: dbConfig['username'],
    password: dbConfig['password'],
    storage: ':memory:',
    models: [User, UserGroup, Expence, Group, UserExpence, UserContact],
})
export default sequelize