import { Injectable } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/postgresql"
import { findEntities, SearchCondition } from "../helper"
import * as model from "src/common/model"

@Injectable()
export class ArticleService {
  constructor(private readonly em: EntityManager) {}
  async search(condition: SearchCondition<model.Article>) {
    return findEntities<model.Article>(this.em, model.Article, condition)
  }

  async findOne(id: number) {
    const result = await this.em.findOne(model.Article, id)
    return result
  }

  async remove(id: number) {
    return await this.em.nativeDelete(model.Article, id)
  }
}
