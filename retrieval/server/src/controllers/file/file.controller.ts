import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
} from "@nestjs/common"
import { Response } from "express"
import { createReadStream } from "fs"
import { FileStorageService } from "src/provider/file-storage.service"

@Controller("api/file")
export class FileController {
  constructor(private readonly fileService: FileStorageService) {}

  @Get(":type/*key")
  getFile(@Res() res: Response, @Param("type") type: "md5" | "doc", @Param("key") key: string) {
    const file = this.fileService.getFileLocation(type, key)
    res.sendFile(file, (err) => {
      if (err) {
        throw new NotFoundException({
          cause: err,
          description: `Response SendFile Error: ${file}`,
        })
      }
    })
  }

  @Post("download/:type/*key")
  async downloadFile(@Param("type") type: "md5" | "doc", @Param("key") key: string) {
    const file = this.fileService.getFileLocation(type, key)
    const stream = createReadStream(file)
    return new StreamableFile(stream)
  }
}
