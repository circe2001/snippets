import { Module } from "@nestjs/common"
import { AccountService } from "./account.service"
import { AccountController } from "./account.controller"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import * as model from "src/common/model"
import { ConfigModule } from "@nestjs/config"
import { FileStorageService } from "src/provider/file-storage.service"

@Module({
  imports: [MikroOrmModule.forFeature([model.Account]), ConfigModule],
  providers: [AccountService, FileStorageService],
  controllers: [AccountController],
})
export class AccountModule {}
