import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { AccountService } from "./account.service"
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard"
import { CurrentUser } from "src/core/user.decorator"
import { httpSuccess, SearchCondition } from "../helper"
import * as model from "src/common/model"

@Controller("api/account")
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("create")
  async create(@CurrentUser("userId") userId: number, @Body() createDto: model.AccountCreate) {
    const id = await this.accountService.create(userId, createDto)
    return httpSuccess({ id })
  }

  @Post("search")
  async search(@Body() condition: SearchCondition<model.Account>) {
    const data = await this.accountService.search(condition)
    return httpSuccess(data)
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const model = await this.accountService.findOne(+id)
    if (!model) {
      throw new HttpException(
        {
          errorMessage: `ID 为 ${id} 的账号不存在`,
        },
        HttpStatus.NOT_FOUND,
      )
    }
    return httpSuccess(model)
  }

  @Post("update")
  async update(@Body() updateDto: model.AccountUpdate) {
    const amount = await this.accountService.update(updateDto)
    return httpSuccess({ amount })
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const amount = await this.accountService.remove(+id)
    return httpSuccess({ amount })
  }
}
