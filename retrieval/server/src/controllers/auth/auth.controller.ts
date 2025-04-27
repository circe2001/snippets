import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard"
import { httpSuccess } from "../helper"

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() signInDto: Record<string, any>) {
    const data = await this.authService.signIn(signInDto.username, signInDto.password)
    return httpSuccess(data)
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Request() req) {
    const data = await this.authService.getProfile(req.user.userId)
    return httpSuccess(data)
  }

  @Post("logout")
  async logout() {
    return httpSuccess(this.authService.logout())
  }
}
