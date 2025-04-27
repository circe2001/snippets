import { EntityManager } from "@mikro-orm/postgresql"
import { Injectable } from "@nestjs/common"
import { FileStorageService } from "src/provider/file-storage.service"
import { findEntities, SearchCondition } from "../helper"
import * as model from "src/common/model"

@Injectable()
export class AccountService {
  constructor(
    private readonly em: EntityManager,
    private readonly fss: FileStorageService,
  ) {}
  async create(userId: number, createDto: model.AccountCreate) {
    const id = await this.em.insert(model.Account, createDto)
    return id
  }

  async search(condition: SearchCondition<model.Account>) {
    return findEntities<model.Account>(this.em, model.Account, condition)
  }

  async findOne(id: number) {
    const result = await this.em.findOne(model.Account, id)
    return result
  }

  async update(dto: model.AccountUpdate) {
    const { id, ...data } = dto
    return await this.em.nativeUpdate(model.Account, id, data)
  }

  async remove(id: number) {
    return await this.em.nativeDelete(model.Account, id)
  }
}
