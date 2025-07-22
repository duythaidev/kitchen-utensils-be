import { TypeOrmModuleOptions } from "@nestjs/typeorm";
require('dotenv').config();
export const ormconfig: TypeOrmModuleOptions = {
    type: process.env.DB_TYPE as any || "mysql",
    host: process.env.DB_HOST || "localhost",
    port: (typeof process.env.DB_PORT === "string" ? parseInt(process.env.DB_PORT) : process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "user",
    password: process.env.DB_PASSWORD || "a",
    database: process.env.DB_DATABASE || "prjdb",
    autoLoadEntities: true
}
// type: 'postgres',
// host: 'localhost',
// port: 5432,
// username: 'postgres',
// password: '',
// database: 'mydb',
// entities: [],
