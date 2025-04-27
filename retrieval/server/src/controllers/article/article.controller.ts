import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Body,
  Post,
  Delete,
} from "@nestjs/common"
import { ArticleService } from "./article.service"
import { httpSuccess, SearchCondition } from "../helper"
import * as model from "src/common/model"

@Controller("api/article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post("search")
  async search(@Body() condition: SearchCondition<model.Article>) {
    const data = await this.articleService.search(condition)
    return httpSuccess(data)
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const model = await this.articleService.findOne(+id)
    if (!model) {
      throw new HttpException(
        {
          errorMessage: `ID 为 ${id} 的法规不存在`,
        },
        HttpStatus.NOT_FOUND,
      )
    }
    return httpSuccess(model)
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const amount = await this.articleService.remove(+id)
    return httpSuccess({ amount })
  }
}
