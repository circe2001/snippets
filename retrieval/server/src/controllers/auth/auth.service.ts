import { EntityManager } from "@mikro-orm/postgresql"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "src/users/users.service"

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username)
    if (user?.pwd !== pass) {
      throw new UnauthorizedException()
    }
    const payload = { userId: user.id, userName: user.name }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  async getProfile(userId: number) {
    return await this.usersService.getProfile(userId)
  }

  async logout() {
    // 登出功能在后端暂无需要实现的业务，只需要前端清除token即可
  }
}

export type JwtPayload = {
  userId: number
  userName: string
  organizationId: number
}
