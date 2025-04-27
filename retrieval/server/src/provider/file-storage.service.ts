import { Injectable } from "@nestjs/common"
import { FileStorageLocation } from "src/common/business-data"
import { getHash } from "src/utils/hash-util"
import { ConfigService } from "@nestjs/config"
import * as iconv from "iconv-lite"

import * as fs from "node:fs"

@Injectable()
export class FileStorageService {
  constructor(private readonly cfg: ConfigService) {}

  // 写入文件（上传，接收）
  getAttachmentFiles(files: Express.Multer.File[]) {
    const attachmentFiles: FileStorageLocation[] = []
    const folder = this.cfg.get("storages.rootFolder") + "/md5/"
    files.forEach((file) => {
      const md5 = getHash("md5", file.buffer)
      const path = folder + md5.slice(0, 3)
      if (fs.existsSync(path) == false) {
        fs.mkdirSync(path)
      }
      const pathFile = path + "/" + md5.slice(3)
      if (fs.existsSync(pathFile) == false) {
        fs.writeFileSync(pathFile, file.buffer)
      }
      const encodedFilename = iconv.decode(Buffer.from(file.originalname, "binary"), "utf-8")
      attachmentFiles.push({
        storageType: "md5",
        fileName: encodedFilename,
        location: md5,
      })
    })
    return attachmentFiles
  }

  // 读取文件（下载，推送）
  readFile(file: FileStorageLocation) {
    const folder = this.cfg.get("storages.rootFolder") + `/${file.storageType}/`
    const pathFile = folder + file.location.slice(0, 3) + "/" + file.location.slice(3)

    return fs.readFileSync(pathFile)
  }

  getFileLocation(type: "md5" | "doc", key: string) {
    const rootFolder = this.cfg.get("storages.rootFolder")
    const [md5] = key.split("/")
    if (type === "md5") {
      return rootFolder + "/md5/" + md5.slice(0, 3) + "/" + md5.slice(3)
    } else {
      return rootFolder + "/doc/" + key
    }
  }
}

export function excludeFile(files: FileStorageLocation[], file: FileStorageLocation) {
  return !includeFile(files, file)
}

export function includeFile(files: FileStorageLocation[], file: FileStorageLocation) {
  for (const f of files) {
    if (
      f.fileName === file.fileName &&
      f.location === file.location &&
      f.storageType === file.storageType
    )
      return true
  }
  return false
}

export function filesFilter(files: FileStorageLocation[], removeFiles: FileStorageLocation[]) {
  return files.filter((file) => excludeFile(removeFiles, file))
}
