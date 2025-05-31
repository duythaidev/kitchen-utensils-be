import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from './modules/carts/carts.module';
import { CartDetailsModule } from './modules/cart_details/cart_details.module';
import { ormconfig } from './config/ormconfig';
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    CategoryModule,
    CartsModule,
    CartDetailsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(ormconfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}