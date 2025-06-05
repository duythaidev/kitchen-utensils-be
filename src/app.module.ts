import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from './modules/carts/carts.module';
import { CartDetailsModule } from './modules/cart_details/cart_details.module';
import { ormconfig } from './config/ormconfig';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    ProductsModule,
    CategoryModule,
    CartsModule,
    CartDetailsModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
