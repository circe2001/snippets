import { MiddlewareConsumer, Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import configuration from "./configuration"
import { AuthModule } from "./controllers/auth/auth.module"
import { UsersModule } from "./users/users.module"
import { MikroOrmMiddleware, MikroOrmModule } from "@mikro-orm/nestjs"
import mikroOrmConfig from "./config/mikro-orm.config"
import { MikroORM } from "@mikro-orm/postgresql"
import { FileModule } from "./controllers/file/file.module"
import { AccountModule } from "./controllers/account/account.module"
import { ArticleModule } from "./controllers/article/article.module"

@Module({
  imports: [
    AccountModule,
    ArticleModule,
    AuthModule,
    UsersModule,
    FileModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MikroOrmModule.forRoot({ autoLoadEntities: false, ...mikroOrmConfig }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up()
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes("*")
  }
}
