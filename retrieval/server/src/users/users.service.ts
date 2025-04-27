import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager } from "@mikro-orm/postgresql"
import { Injectable } from "@nestjs/common"
import { Profile } from "src/common/user"
import * as model from "src/common/model"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(model.Account)
    private readonly em: EntityManager,
  ) {}
  async findOne(username: string) {
    return await this.em.findOne(model.Account, {
      $or: [{ name: username }, { email: username }, { mobile: username }],
    })
  }

  async getProfile(userId: number) {
    const account = await this.em.findOne(model.Account, { id: userId })
    if (!account) {
      throw new Error("用户不存在")
    }
    const profile: Profile = {
      id: account.id,
      username: account.name,
      lockType: account.lockType,
      pwdErrorTimes: account.pwdErrorTimes!,
      pwdErrorLatestTime: account.pwdErrorLatestTime,
      aliasName: account.aliasName,
      mobile: account.mobile,
      email: account.email,
      needChangePwd: account.needChangePwd!,
      lastLogin: account.lastLogin,
      firstLogin: account.firstLogin,
      isEnable: account.isEnable!,
      lockedTime: account.lockedTime,
      remark: account.remark,
    }
    profile.role = "public"
    return profile
  }
}
