import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import * as model from "src/common/model"
import { MikroOrmModule } from "@mikro-orm/nestjs"

@Module({
  imports: [MikroOrmModule.forFeature([model.Account])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
