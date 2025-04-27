import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { FileController } from "./file.controller"
import { FileStorageService } from "src/provider/file-storage.service"

@Module({
  imports: [ConfigModule],
  providers: [FileStorageService],
  controllers: [FileController],
})
export class FileModule {}
