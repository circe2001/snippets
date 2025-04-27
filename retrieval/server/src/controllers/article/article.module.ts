import { Module } from "@nestjs/common"
import { ArticleController } from "./article.controller"
import { ArticleService } from "./article.service"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import * as model from "src/common/model"
import { ConfigModule } from "@nestjs/config"
import { FileStorageService } from "src/provider/file-storage.service"

@Module({
  imports: [MikroOrmModule.forFeature([model.Article]), ConfigModule],
  providers: [ArticleService, FileStorageService],
  controllers: [ArticleController],
})
export class ArticleModule {}
