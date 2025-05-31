import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const ormconfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "user",
    password: "a",
    database: "prjdb",
    synchronize: true,
    autoLoadEntities: true
}